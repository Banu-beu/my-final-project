import { Request,Response,NextFunction } from "express"
import { Orders, validateOrder } from "./order.model";
import { editMessage, errorMessage } from "../../utils/infoMessages";
import { Products } from "../products/product.model";


export const myOrders=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const userId=(req.user as any)?.id;
        const orders=await Orders.findAll({
            where: {userId},
            order:[["createdAt","DESC"]],
        })
        res.status(200).json({count:orders.length,data:orders})
    } catch (error) {
        next(error)
        
    }
}


export const singleOrder=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const order=await Orders.findByPk(Number(req.params.id))
        if(!order){
            return res.status(404).json(errorMessage("Order not found"))
        }

        const currentUser=(req.user as any)
        if(currentUser.role !=="admin" && order.userId !==currentUser.id){
            return res.status(403).json(errorMessage("You do not have permission to view this order."))
        }
        res.status(200).json({data:order})
    } catch (error) {
        next(error)
    }
}

export const allOrders=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const orders=await Orders.findAll({order:[["createdAt","DESC"]]})
        res.status(200).json({count:orders.length,data:orders})
    } catch (error) {
next(error)        
    }
}

export const updateOrderStatus=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const{error}=validateOrder(req.body)
        if(error){
            return res.status(400).json(errorMessage("Validate error",error))
        }
        const order=await Orders.findByPk(Number(req.params.id))
        if(!order){
            return res.status(404).json(errorMessage("Order not found"))
        }
        await order.update({status:req.body.status})
        res.status(200).json(editMessage("Order status",order))
    } catch (error) {
        next(error)
    }
}

export const cancelOrder=async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const order=await Orders.findByPk(Number(req.params.id))
        if(!order){
            return res.status(404).json(errorMessage("Order not found"))
        }
        const currentUser=(req.user as any)
        if(order.userId!==currentUser.id){
            return res.status(403).json(errorMessage("You do not have permission to cancel this order."))
        }
        if(order.status !=="pending"){
            return res.status(400).json(errorMessage("Only orders with 'pending' status can be canceled"))
        }
        for(const item of order.products){
            await Products.increment("stock",{
                by:item.quantity,
                where:{id:item.productId}
            })
        }
        await order.update({status:"cancelled"})
        res.status(200).json(editMessage("Order",order))
    } catch (error) {
        next(error)
    }
}
