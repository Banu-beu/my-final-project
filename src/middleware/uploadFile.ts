import multer, { Multer } from "multer";
import { Request } from "express";

export const storage=multer.diskStorage({
    destination:function(req:Request,file:any,cb:any){
        cb(null,'./src/uploads')
    },
    filename:function(req:Request,file:any,cb:any){
        cb(null,Date.now()+'-'+file.originalname)
    }
})

    export const upload=multer({
        storage:storage,
        limits: {fileSize:10*1024*1024},
        fileFilter:function(req:Request,file:any,cb:any){
            if(file.mimetype==="image/jpeg" || file.mimetype==="image/png" || file.mimetype==="image/webp"){
                cb(null,true)
            } else{
                cb(new Error("Upload only jpg,png,webp form of photos"))
            }
        }
    })
