import express from "express";
import {
  allProducts,
  createProduct,
  deleteProduct,
  editProduct,
  singleProduct,
} from "./product.controller";
import { authMiddleware, isAdmin } from "../../middleware/auth";
import { upload } from "../../middleware/uploadFile"

const router = express.Router();

router.get("/:id", singleProduct);
router.get("/", allProducts);

router.post(
  "/",  authMiddleware, isAdmin,
upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  editProduct
);

router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

export default router;