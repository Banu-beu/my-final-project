import { Router } from "express";
import { getBasket, addToBasket, removeFromBasket, clearBasket, checkoutBasket } from "./basket.controller";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/", authMiddleware, getBasket);
router.post("/add", authMiddleware, addToBasket);
router.delete("/remove/:productId", authMiddleware, removeFromBasket);
router.delete("/clear", authMiddleware, clearBasket);
router.post("/checkout", authMiddleware, checkoutBasket);

export default router;