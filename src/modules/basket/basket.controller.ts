import { Request, Response,NextFunction } from "express";
import { Baskets,validateBasket,validateAddToBasket } from "./basket.model";
import { Op } from "sequelize";
import { Products } from "../products/product.model";
import { Orders } from "../order/order.model";
import { Users } from "../user/user.model";

export const getBasket = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const basket = await Baskets.findOne({ where: { userId: (req.user as any)?.id } });
    if (!basket) {
      return res.status(404).json({ message: "Basket is empty" });
    }
    res.status(200).json({ data: basket });
  } catch (error) {
    next(error)
  }
};

export const addToBasket = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const{error}=validateAddToBasket(req.body)
    if(error){
      return res.status(400).json({message:error.details[0].message})
    }

    const { productId, quantity } = req.body;
    const userId = (req.user as any)?.id;

    if(!Number.isInteger(quantity) || quantity<=0){
      return res.status(400).json({message:"Quantity must be a positive integer"})
    }

    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let basket = await Baskets.findOne({ where: { userId } });

        const alreadyInBasket = !basket
      ? 0
      : ((typeof basket.products === "string" ? JSON.parse(basket.products) : basket.products) as { productId: number; quantity: number }[])
          .find((p) => p.productId === productId)?.quantity || 0;

    if (product.stock < alreadyInBasket + quantity) {
      return res.status(400).json({ message: `Only ${product.stock} item(s) left in stock` });
    }

    if (!basket) {
      basket = await Baskets.create({
        userId: userId as number,
        products: [{ productId, quantity, price: product.price as number }],
        totalAmount: (product.price as number) * quantity,
      });
    } else {
      const products = (typeof basket.products === "string"
        ? JSON.parse(basket.products)
        : basket.products) as { productId: number; quantity: number; price: number }[];

      const existingIndex = products.findIndex((p) => p.productId === productId);

      if (existingIndex > -1) {
        products[existingIndex].quantity += quantity;
      } else {
        products.push({ productId, quantity, price: product.price as number });
      }

      const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
      await basket.update({ products, totalAmount });
    }

    res.status(200).json({ message: "Product added", data: basket });
  } catch (error) {
    console.error("BASKET ERROR:", error);
    next(error)
  }
};

export const removeFromBasket = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { productId } = req.params;
    const userId = (req.user as any)?.id;
    const basket = await Baskets.findOne({ where: { userId } });
    if (!basket) {
      return res.status(404).json({ message: "Basket not found" });
    }

    const products = basket.products.filter((p) => p.productId !== Number(productId));
    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    await basket.update({ products, totalAmount });

    res.status(200).json({ message: "Product deleted", data: basket });
  } catch (error) {
    next(error)
  }
};

export const clearBasket = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const basket = await Baskets.findOne({ where: { userId: (req.user as any)?.id } });
    if (!basket) {
      return res.status(404).json({ message: "Basket not found" });
    }

    await basket.update({ products: [], totalAmount: 0 });

    res.status(200).json({ message: "Basket cleared" });
  } catch (error) {
    next(error)
  }
};

export const checkoutBasket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { address } = req.body;
    const userId = (req.user as any)?.id;

    const basket = await Baskets.findOne({ where: { userId } });
    if (!basket || basket.products.length === 0) {
      return res.status(400).json({ message: "Basket is empty" });
    }

    for (const item of basket.products) {
      const product = await Products.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.titleAz}. Only ${product.stock} left.` 
        });
      }
    }

    for (const item of basket.products) {
      await Products.decrement("stock", {
        by: item.quantity,
        where: { id: item.productId },
      });
    }

    const order = await Orders.create({
      userId: userId as number,
      address,
      products: basket.products,
      totalAmount: basket.totalAmount,
      status: "pending",
    });

    const earnedPoints = Math.floor(basket.totalAmount * 0.05);
    const user = await Users.findByPk(userId);
    if (user) {
      await user.increment("bonusPoints", { by: earnedPoints });
    }

    await basket.update({ products: [], totalAmount: 0 });

    res.status(201).json({ message: "Order placed", data: order, earnedPoints });
  } catch (error) {
    next(error);
  }
};