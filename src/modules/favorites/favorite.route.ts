import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { addFavorite, myFavorites, removeFavorite } from "./favorite.controller";

const router=Router()

router.get("/my",authMiddleware,myFavorites)
router.post("/add/:productId",authMiddleware,addFavorite)
router.delete("/remove/:productId",authMiddleware,removeFavorite)

export default router