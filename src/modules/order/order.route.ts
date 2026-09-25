import { Router } from "express";
import { authMiddleware, isAdmin } from "../../middleware/auth";
import { allOrders, cancelOrder, myOrders, singleOrder, updateOrderStatus } from "./order.controller";


const router=Router()

router.get("/my",authMiddleware,myOrders)
router.get("/:id",authMiddleware,singleOrder)
router.get("/",authMiddleware,isAdmin,allOrders)
router.put("/:id/status",authMiddleware,isAdmin,updateOrderStatus)
router.put("/:id/cancel",authMiddleware,cancelOrder)

export default router;