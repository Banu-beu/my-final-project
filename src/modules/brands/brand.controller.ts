import { Request, Response } from "express";
import slugify from "slugify"
import {
  createMessage,
  errorMessage,
  deleteMessage,
  editMessage,
} from "../../utils/infoMessages";
import { Brands, validateBrand } from "./brand.model";

export const allBrands = async (req: Request, res: Response) => {
  try {
    const brands = await Brands.findAll();
    res.status(200).json({ data: brands });
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const singleBrand = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const brand = await Brands.findByPk(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { error } = validateBrand(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const slug=slugify(req.body.titleAz,{lower:true,strict:true})

    const brand = await Brands.create({...req.body,slug});
    res.status(200).json(createMessage("Brand", brand));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const editBrand = async (req: Request, res: Response) => {
  try {
    const { error } = validateBrand(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const brand = await Brands.findByPk(Number(req.params.id));
    if (!brand) {
      return res.status(404).json(errorMessage("Brand not found"));
    }

    const updateData:any={...req.body}
    if(req.body.titleAz){
      updateData.slug=slugify(req.body.titleAz,{lower:true,strict:true})
    }



    await brand.update(updateData);
    res.status(200).json(editMessage("Brand updated", brand));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await Brands.findByPk(Number(req.params.id));
    if (!brand) {
      return res.status(404).json(errorMessage("Brand not found"));
    }

    await brand.destroy();
    res.status(200).json(deleteMessage("Brand", brand));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};