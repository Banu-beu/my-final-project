import express from "express"
import { allBlogs, createBlog, deleteBlog, editBlog, singleBlog } from "./blog.controller"
import { authMiddleware, isAdmin } from "../../middleware/auth"
import { upload } from "../../middleware/uploadFile"

const router=express.Router()

router.get("/:id",singleBlog)
router.get("/",allBlogs)
router.post("/",authMiddleware,isAdmin,upload.single("coverImage"),createBlog)
router.put("/:id",authMiddleware,isAdmin,upload.single("coverImage"),editBlog)
router.delete("/:id",authMiddleware,isAdmin,deleteBlog)

export default router