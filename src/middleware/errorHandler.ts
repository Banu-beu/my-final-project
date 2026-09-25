import { Request,Response,NextFunction } from "express";
import multer from "multer"


export const errorHandler=(
    err:any,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    console.error("Global error",err);
    


    if(err.name === "SequelizeUniqueConstraintError"){
        const field=err.errors?.[0]?.path || "field"
        return res.status(400).json({message:`This ${field} has already used`})
    }

    if(err.name === "SequelizeValidationError"){
        const messages=err.errors?.map((e:any)=>e.message).join(",")
        return res.status(400).json({message:messages || "Validation error"})
    }
    if(err.name==="SequelizeForeignKeyConstraintError"){
        return res.status(400).json({message:"The referenced record (id) does not exist"})
    }
    if(err.name==="TokenExpiredError"){
        return res.status(401).json({message:"The token has expired, please log in again."})
    }
    if(err.name==="JsonWebTokenError"){
        return res.status(401).json({message:"Wrong token"})
    }
    if(err instanceof multer.MulterError){
        return res.status(400).json({message:`File error:${err.message}`})
    }
    if(err&&err.message){
        return res.status(400).json({message:err.message})
    }
    res.status(500).json({message:"Something went wrong"})
}