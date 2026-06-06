import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
} from "./product.controller";

const router = express.Router();

router.post("/", createProduct);
router.put("/:id", editProduct);
router.delete("/:id", deleteProduct);

export default router;