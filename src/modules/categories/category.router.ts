import express, { Router } from 'express'
import {  allCategories, createCategory, deleteCategory, editCategory, singleCategory } from './category.controller'
import { authMiddleware, isAdmin } from '../../middleware/auth'

const router=express.Router()


router.get('/:id',singleCategory)
router.get('/',allCategories)
router.post('/',authMiddleware, isAdmin,createCategory)
router.put('/:id',authMiddleware, isAdmin,editCategory)
router.delete('/:id',authMiddleware, isAdmin,deleteCategory)

export default router;