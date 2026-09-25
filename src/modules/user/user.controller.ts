
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import {
  errorMessage,
  deleteMessage,
  editMessage,
} from "../../utils/infoMessages";
import { Users, validateUser,validateUserUpdate } from "./user.model";
import { Orders } from "../order/order.model";
import { Op } from "sequelize";
import { Favorites } from "../favorites/favorite.model";
import { Baskets } from "../basket/basket.model";
import { deleteSingleOldImage } from "../../utils/deleteOldImages";


export const myProfile=async(req:Request,res:Response)=>{
  try {
    const userId=(req.user as any)?.id
    const user=await Users.findByPk(userId,{
      attributes:{exclude:["password","accessToken","refreshToken"]}
    })

    if(!user){
      return res.status(404).json(errorMessage("User not found"))
    }

    const totalOrders=await Orders.count({where:{userId}})
    const totalSpent=await Orders.sum("totalAmount",{
      where:{userId,status:{[Op.ne]: "cancelled"}}
    })

    const favorite=await Favorites.findOne({where:{userId}})
    const basket=await Baskets.findOne({where:{userId}})

    const stats={totalOrders,
      totalSpent:totalSpent || 0,
      favoritesCount:favorite?favorite.products.length : 0,
      basketItemsCount:basket?basket.products.length : 0,
}



    res.status(200).json({data:{...user.get({plain:true}),stats}})
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong",error))
  }
}

export const editMyProfile=async (req:Request,res:Response)=>{
  try {
    const{error}=validateUserUpdate(req.body)
    if(error){
      return res.status(400).json(errorMessage("Validate error",error))
    }
    const userId=(req.user as any)?.id
    const user=await Users.findByPk(userId)
    if(!user){
      return res.status(404).json(errorMessage("User not found"))
    }

    const current=user.get() as any

    if(req.body.email && req.body.email!==current.email){
      if(current.registerMethod==="googleAuth"){
        return res.status(400).json(errorMessage("The email address for a Google account cannot be changed"))

      }

      const taken=await Users.findOne({
        where:{email:req.body.email,id:{[Op.ne]:userId}}
      })
      if(taken){
        return res.status(400).json(errorMessage("This email already used"))
      }
    }

    const {role,bonusPoints,...safeData}=req.body

    await user.update(safeData)
    res.status(200).json(editMessage("Profile updated",user))

  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong",error))
  }
}

  export const changePassword=async(req:Request,res:Response)=>{
    try {
      const {currentPassword,newPassword}=req.body
      if(!currentPassword || !newPassword){
        return res.status(400).json(errorMessage("currentPassword and newPassword are required"))
      }
      if(newPassword.length<6){
        return res.status(400).json(errorMessage("new password must be at least 6 character"))
      }

      const userId=(req.user as any)?.id
      const user=await Users.findByPk(userId)
      if(!user){
        return res.status(404).json(errorMessage("User not found"))
      }

      const current=user.get() as any

      if(current.registerMethod=== "googleAuth"){
        return res.status(400).json(errorMessage("There is no password for google account"))
      }
      const isMatch =await bcrypt.compare(currentPassword,current.password)
      if(!isMatch){
        return res.status(400).json(errorMessage("Current password is wrong"))
      }

      const hashedPassword=await bcrypt.hash(newPassword,10)
      await user.update({password:hashedPassword})
      res.status(200).json({message:"Password has changed successfully"})

    } catch (error) {
      res.status(500).json(errorMessage("Something went wrong",error))      
    }
  }


  export const uploadProfileImage=async (req:Request,res:Response)=>{
    try {
      const file=req.file as Express.Multer.File | undefined
      if(!file){
        return res.status(400).json(errorMessage("Image is required"))
      }

      const userId=(req.user as any)?.id
      const user=await Users.findByPk(userId)
      if(!user){
        return res.status(404).json(errorMessage("User not found"))
      }

      const oldImage=(user.get() as any).image
      if(oldImage){
        deleteSingleOldImage(oldImage)        
      }

       await user.update({image:file.path})
       res.status(200).json(editMessage("Profile picture",user))

    } catch (error) {
      res.status(500).json(errorMessage("Something went wrong",error))
    }
  }



  export const deleteProfileImage=async (req:Request,res:Response)=>{
    try {
      const userId=(req.user as any)?.id
      const user=await Users.findByPk(userId)
      if(!user){
        return res.status(404).json(errorMessage("User not found"))
      }
      const image=(user.get()as any).image
      if(!image){
        return res.status(404).json(errorMessage("You don't have a profile picture"))
      }
      deleteSingleOldImage(image)
      await user.update({image:null})
      res.status(200).json(deleteMessage("Profile picture",user))
    } catch (error) {
      res.status(500).json(errorMessage("Something went wrong",error))
    }
  }



export const allUsers = async (req: Request, res: Response) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ["password", "accessToken", "refreshToken"] },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const singleUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const user = await Users.findByPk(id, {
      attributes: { exclude: ["password", "accessToken", "refreshToken"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const editUser = async (req: Request, res: Response) => {
  try {
    const { error } = validateUserUpdate(req.body);
    if (error) {
      return res.status(400).json(errorMessage("Validate error", error));
    }

    const user = await Users.findByPk(Number(req.params.id));
    if (!user) {
      return res.status(404).json(errorMessage("User not found"));
    }

    await user.update(req.body);
    res.status(200).json(editMessage("User updated", user));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await Users.findByPk(Number(req.params.id));
    if (!user) {
      return res.status(404).json(errorMessage("User not found"));
    }

    await user.destroy();
    res.status(200).json(deleteMessage("User", user));
  } catch (error) {
    res.status(500).json(errorMessage("Something went wrong", error));
  }
};