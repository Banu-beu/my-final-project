import { Request, Response } from "express";
import { Baskets } from "./basket.model";
import { Products } from "../products/product.model";
import { Orders } from "../order/order.model";

export const getBasket = async (req: Request, res: Response) => {
  try {
    const basket = await Baskets.findOne({ where: { userId: (req.user as any)?.id } });
    if (!basket) {
      return res.status(404).json({ message: "Basket boşdur" });
    }
    res.status(200).json({ data: basket });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const addToBasket = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req.user as any)?.id;

    const product = await Products.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    let basket = await Baskets.findOne({ where: { userId } });

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

    res.status(200).json({ message: "Məhsul əlavə edildi", data: basket });
  } catch (error) {
    console.error("BASKET ERROR:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const removeFromBasket = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = (req.user as any)?.id;
    const basket = await Baskets.findOne({ where: { userId } });
    if (!basket) {
      return res.status(404).json({ message: "Basket tapılmadı" });
    }

    const products = basket.products.filter((p) => p.productId !== Number(productId));
    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    await basket.update({ products, totalAmount });

    res.status(200).json({ message: "Məhsul silindi", data: basket });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const clearBasket = async (req: Request, res: Response) => {
  try {
    const basket = await Baskets.findOne({ where: { userId: (req.user as any)?.id } });
    if (!basket) {
      return res.status(404).json({ message: "Basket tapılmadı" });
    }

    await basket.update({ products: [], totalAmount: 0 });

    res.status(200).json({ message: "Basket təmizləndi" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const checkoutBasket = async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    const userId = (req.user as any)?.id;

    const basket = await Baskets.findOne({ where: { userId } });
    if (!basket || basket.products.length === 0) {
      return res.status(400).json({ message: "Basket boşdur" });
    }

    const order = await Orders.create({
      userId: userId as number,
      address,
      totalAmount: basket.totalAmount,
      status: "pending",
    });

    await basket.update({ products: [], totalAmount: 0 });

    res.status(201).json({ message: "Sifariş verildi", data: order });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};