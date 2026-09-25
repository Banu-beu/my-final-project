import express from 'express'
import { allUsers, changePassword, deleteProfileImage, deleteUser, editMyProfile, editUser, myProfile, singleUser, uploadProfileImage } from './user.controller'
import { authMiddleware, isAdmin } from '../../middleware/auth';
import { upload } from '../../middleware/uploadFile';

const router=express.Router()

router.get("/me",authMiddleware,myProfile)
router.put("/me",authMiddleware,editMyProfile)
router.put("/change-password",authMiddleware,changePassword)
router.post("/image",authMiddleware,upload.single("image"),uploadProfileImage)
router.delete("/image",authMiddleware,deleteProfileImage)

router.get("/:id",  authMiddleware, isAdmin, singleUser);
router.get("/",authMiddleware, isAdmin,  allUsers);
router.put("/:id", authMiddleware, isAdmin, editUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

export default router;