import { Request,Response } from "express";
import { Products } from "../products/product.model";
import { errorMessage } from "../../utils/infoMessages";
import {Favorites} from "./favorite.model"





export const addFavorite=async(req:Request,res:Response)=>{
    try {
        const userId=(req.user as any)?.id
        const productId=Number(req.params.productId)
        const product=await Products.findByPk(productId)

        if(!product){
            return res.status(404).json(errorMessage("Product not found"))
        }

        let favorite=await Favorites.findOne({where:{userId}})

        if(!favorite){
            favorite=await Favorites.create({userId,products:[productId]})
            return res.status(201).json({message:"Added to favorites",data:favorite})
        }

        if(favorite.products.includes(productId)){
            return res.status(400).json(errorMessage("Already added to favorites"))
        }

        const updatedProducts=[...favorite.products,productId]
        await favorite.update({products:updatedProducts})

        res.status(200).json({message:"Added to favorites",data:favorite})


    } catch (error) {
      res.status(500).json(errorMessage("Something went wrong",error))  
    }
}

    export const removeFavorite=async(req:Request,res:Response)=>{
        try {
            const userId=(req.user as any)?.id
            const productId=Number(req.params.productId)
            const favorite=await Favorites.findOne({where:{userId}})

            if(!favorite){
                return res.status(404).json(errorMessage("Your wishlist is empty"))
            }

            const updatedProducts=favorite.products.filter((id)=>id!==productId)
            await favorite.update({products:updatedProducts})

            res.status(200).json({message:"Removed from favorites",data:favorite})

        } catch (error) {
            res.status(500).json(errorMessage("Something went wrong",error))
        }
    }


    export const myFavorites=async(req:Request,res:Response)=>{
        try {
            const userId=(req.user as any)?.id
            const favorite=await Favorites.findOne({where:{userId}})

            if(!favorite||favorite.products.length===0){
                return res.status(200).json({count:0,data:[]})
            }

            const products=await Products.findAll({
                where:{id:favorite.products},
            })

            res.status(200).json({count:products.length,data:products})

        } catch (error) {
            res.status(500).json(errorMessage("Something went wrong",error))
        }
    }