import { Request, Response } from "express";
import {
  createMessage,
  errorMessage,
  deleteMessage,
  editMessage,
} from "../../utils/infoMessages";
import { Categories, validateCategory } from "./category.model";

export const allCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Categories.findAll();
    res.status(200).json({ data: categories });
  } catch (error) {
    console.log(error);
  }
};

export const singleCategory = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const category = await Categories.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    console.log(error);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const category = await Categories.create(req.body);
    res.status(200).json(createMessage("Category", category));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const category = await Categories.findByPk(Number(req.params.id));
    if (!category) {
      return res.status(404).json(errorMessage("Category not found"));
    }

    await category.update(req.body);
    res.status(200).json(editMessage("Category updated", category));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Categories.findByPk(Number(req.params.id));
    if (!category) {
      return res.status(404).json(errorMessage("Category not found"));
    }

    await category.destroy();
    res.status(200).json(deleteMessage("Category", category));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};