import express from "express";
import { allProducts, singleProduct } from "../modules/products/product.controller";


const router = express.Router();

router.get("/products/:id", singleProduct);
router.get("/products", allProducts);


export default router;