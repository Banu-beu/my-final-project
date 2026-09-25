import { Request, Response,NextFunction } from "express";
import slugify from "slugify"
import {
  createMessage,
  errorMessage,
  deleteMessage,
  editMessage,
} from "../../utils/infoMessages";

import { Op } from "sequelize"; 
import { Products, validateProduct } from "./product.model";
import { Categories } from "../categories/category.model";
import { Brands } from "../brands/brand.model";
import { deleteManyOldImages, deleteSingleOldImage } from "../../utils/deleteOldImages";

export const allProducts = async (req: Request, res: Response) => {
  try {
    const { 
      search, 
      sort, 
      stock,
      page,
      limit,
      brandId,
      categoryId,
      color,
      priceUnder, 
      priceOver,  
      minPrice,   
      maxPrice, 
    stockUnder, 
    stockOver,  
      minStock,   
      maxStock  ,
      
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

    if(categoryId){
      whereCondition.categoryId=Number(categoryId)
    }
    if(brandId){
      whereCondition.brandId=Number(brandId)
    }
    if(color){
      whereCondition.color=color
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


    const currentPage=Number(page) || 1
    const pageLimit=Number(limit) || 12
    const offset=(currentPage-1)*pageLimit
    

    const {count,rows} = await Products.findAndCountAll({
      include: [
        { 
          model: Brands, 
          as: "brand"
        },
        { 
          model: Categories, 
          as: "category" 
        }
      ],
      where: whereCondition,
      order: orderCondition,
      limit:pageLimit,
      offset,
      distinct:true
    });

    res.status(200).json({
      totalCount: count,
      totalPages: Math.ceil(count/pageLimit),
      currentPage,
      data:rows
    });

  } catch (error) {
    console.log("FILTER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const singleProduct = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const param=req.params.id
    const isNumeric=!isNaN(Number(param))

    const product = isNumeric
    ?await Products.findByPk(Number(param))
    :await Products.findOne({where:{slug:param}})

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    next(error)  }
};

export const createProduct = async (req: Request, res: Response,next:NextFunction) => {
  try {
        if (typeof req.body.installmentMonths === "string") {
      req.body.installmentMonths = req.body.installmentMonths
        .split(",")
        .map((m: string) => Number(m.trim()))
        .filter((m: number) => !isNaN(m));
    }
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    const coverImage = files?.coverImage?.[0]?.path;
    const images = files?.images?.map((file) => file.path) || [];

    if (!coverImage) {
      return res.status(400).json(errorMessage("Coverimage is required"));
    }

    const slug=slugify(req.body.titleAz,{lower:true,strict:true})

    const product = await Products.create({
      ...req.body,
      slug,
      coverImage,
      images,
    });

    res.status(201).json(createMessage("Product", product));
  } catch (error) {
    next(error)
  }
};

export const editProduct = async (req: Request, res: Response,next:NextFunction) => {
  try {
     if (typeof req.body.installmentMonths === "string") {
      req.body.installmentMonths = req.body.installmentMonths
        .split(",")
        .map((m: string) => Number(m.trim()))
        .filter((m: number) => !isNaN(m))
    }
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const product = await Products.findByPk(Number(req.params.id));
    if (!product) {
      return res.status(404).json(errorMessage("Product not found"));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const updateData: any = { ...req.body };

    if(req.body.titleAz){
      updateData.slug=slugify(req.body.titleAz,{lower:true,strict:true})
    }


    if (files?.coverImage?.[0]) {
      deleteSingleOldImage(product.coverImage);
      updateData.coverImage = files.coverImage[0].path;
    }

    if (files?.images && files.images.length > 0) {
      deleteManyOldImages(product.images);
      updateData.images = files.images.map((file) => file.path);
    }

    await product.update(updateData);
    res.status(200).json(editMessage("Product updated", product));
  } catch (error) {
    next(error)
  }
};

export const deleteProduct = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const product = await Products.findByPk(Number(req.params.id));
    if (!product) {
      return res.status(404).json(errorMessage("Product not found"));
    }

    deleteSingleOldImage(product.coverImage);
    deleteManyOldImages(product.images);

    await product.destroy();
    res.status(200).json(deleteMessage("Product", product));
  } catch (error) {
    next(error)
  }
};