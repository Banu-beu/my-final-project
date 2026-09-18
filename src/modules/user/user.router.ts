import express from 'express'
import { allUsers, deleteUser, editUser, singleUser } from './user.controller'
import { authMiddleware, isAdmin } from '../../middleware/auth';

const router=express.Router()


router.get("/:id", singleUser);
router.get("/",  allUsers);
router.put("/:id", authMiddleware, isAdmin, editUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

export default router;