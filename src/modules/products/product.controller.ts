import { Request, Response } from "express";
import {
  createMessage,
  errorMessage,
  deleteMessage,
  editMessage,
} from "../../utils/infoMessages";

import { Op } from "sequelize"; 
import { Products, validateProduct } from "./product.model";

export const allProducts = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      sort, 
      stock,
      priceUnder, 
      priceOver,  
      minPrice,   
      maxPrice, 
    stockUnder, 
    stockOver,  
      minStock,   
      maxStock  ,
     ratingUnder, 
    ratingOver,  
      minRating,   
      maxRating    
    } = req.query;

    let whereCondition: any = {};

    if (search) {
      whereCondition[Op.or] = [
        { titleAz: { [Op.like]: `%${search}%` } },
        { titleRu: { [Op.like]: `%${search}%` } },
        { titleEn: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } }
      ];
    }

    if (priceUnder) {
      whereCondition.price = { [Op.lte]: Number(priceUnder) };
    } 
    else if (priceOver) {
      whereCondition.price = { [Op.gte]: Number(priceOver) };
    } 
    else if (minPrice || maxPrice) {
      whereCondition.price = {};
      if (minPrice) whereCondition.price[Op.gte] = Number(minPrice);
      if (maxPrice) whereCondition.price[Op.lte] = Number(maxPrice);
    }
 
    if (ratingUnder) {
      whereCondition.rating = { [Op.lte]: Number(ratingUnder) };
    } 
    else if (ratingOver) {
      whereCondition.rating = { [Op.gte]: Number(ratingOver) };
    } 
    else if (minRating || maxRating) {
      whereCondition.rating = {};
      if (minRating) whereCondition.rating[Op.gte] = Number(minRating);
      if (maxRating) whereCondition.rating[Op.lte] = Number(maxRating);
    }


    if (stockUnder) {
      whereCondition.stock = { [Op.lte]: Number(stockUnder) };
    } 
    else if (stockOver) {
      whereCondition.stock = { [Op.gte]: Number(stockOver) };
    } 
    else if (minStock|| maxStock) {
      whereCondition.stock = {};
      if (minStock) whereCondition.stock[Op.gte] = Number(minStock);
      if (maxStock) whereCondition.stock[Op.lte] = Number(maxStock);
    }


    let orderCondition: any = [["createdAt", "DESC"]];
    if (sort) {
      if (sort === "cheapToExpensive") orderCondition = [["price", "ASC"]];
      else if (sort === "expensiveToCheap") orderCondition = [["price", "DESC"]];
      else if (sort === "alphabetical") orderCondition = [["titleAz", "ASC"]];
    }

    const products = await Products.findAll({
      where: whereCondition,
      order: orderCondition
    });

    res.status(200).json({
      count: products.length,
      data: products
    });

  } catch (error) {
    console.log("FILTER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const singleProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const product = await Products.create(req.body);
    res.status(200).json(createMessage("Product", product));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const product = await Products.findByPk(Number(req.params.id));
    if (!product) {
      return res.status(404).json(errorMessage("Product not found"));
    }

    await product.update(req.body);
    res.status(200).json(editMessage("Product updated", product));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Products.findByPk(Number(req.params.id));
    if (!product) {
      return res.status(404).json(errorMessage("Product not found"));
    }

    await product.destroy();
    res.status(200).json(deleteMessage("Product", product));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};