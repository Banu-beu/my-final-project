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
export const upload=multer({storage:storage})