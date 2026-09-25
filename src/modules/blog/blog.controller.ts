import { Request,Response } from "express";
import slugify from "slugify"
import { Blogs, validateBlog } from "./blog.model";
import { createMessage, deleteMessage, editMessage, errorMessage } from "../../utils/infoMessages";
import { deleteSingleOldImage } from "../../utils/deleteOldImages";



export const allBlogs=async(req:Request,res:Response)=>{
    try {
        const page=Number(req.query.page) || 1
        const limit=Number(req.query.limit) || 10
        const offset=(page-1)*limit

        const {count,rows} =await Blogs.findAndCountAll({
            order:[["createdAt","DESC"]],limit,offset
        })

        res.status(200).json({
            totalCount:count,
            totalPages:Math.ceil(count/limit),
            currentPage:page,
            data:rows
        })

    } catch (error) {
        res.status(500).json(errorMessage('Something went wrong',error))
    }
}

export const singleBlog=async(req:Request,res:Response)=>{
    try {
        const param=req.params.id
        const isNumeric=!isNaN(Number(param))

        const blog=isNumeric ? await Blogs.findByPk(Number(param)) : await Blogs.findOne({where:{slug:param}})

        if(!blog){
            return res.status(404).json(errorMessage("Blog not found"))
        }
        res.status(200).json({data:blog})

    } catch (error) {
        res.status(500).json(errorMessage("Something went wrong",error))
    }
}


export const createBlog=async(req:Request,res:Response)=>{
    try {
        const {error}=validateBlog(req.body)
        if(error){
            return res.status(400).json(errorMessage("Validate error",error))
        }

        const file=req.file as Express.Multer.File | undefined
        if(!file){
            return res.status(400).json(errorMessage("coverImage is required"))
        }

        const slug=slugify(req.body.titleAz,{lower:true,strict:true})
        const blog=await Blogs.create({...req.body,slug,coverImage:file.path})
        res.status(201).json(createMessage("Blog",blog))
    } catch (error) {
        res.status(500).json(errorMessage("Something went wrong",error))
    }
}



export const editBlog= async(req:Request,res:Response)=>{
    try {
        const{error}=validateBlog(req.body)
        if(error){
            return res.status(400).json(errorMessage("Validate error",error))
        }
        const blog=await Blogs.findByPk(Number(req.params.id))
        if(!blog){
            return res.status(404).json(errorMessage("Blog not found"))
        }

        const file=req.file as Express.Multer.File |undefined
        const updateData:any={...req.body}

        if(req.body.titleAz){
            updateData.slug=slugify(req.body.titleAz,{lower:true,strict:true})
        }

        if(file){
            deleteSingleOldImage(blog.coverImage)
            updateData.coverImage=file.path
        }

        await blog.update(updateData)
        res.status(200).json(editMessage("Blog updated",blog))
    } catch (error) {
        res.status(500).json(errorMessage("Something went wrong",error))
    }
}

export const deleteBlog=async(req:Request,res:Response)=>{
    try{
        const blog=await Blogs.findByPk(Number(req.params.id))
        if(!blog){
            return res.status(404).json(errorMessage("Blog not found"))
        }
        deleteSingleOldImage(blog.coverImage)
        await blog.destroy()
        res.status(200).json(deleteMessage("Blog",blog))
    }
    catch (error){
        res.status(500).json(errorMessage("Something went wrong",error))
    }
}