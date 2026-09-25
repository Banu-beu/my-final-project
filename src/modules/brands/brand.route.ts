import express, { Router } from 'express'
import { allBrands, createBrand, deleteBrand, editBrand, singleBrand } from './brand.controller'
import { authMiddleware, isAdmin } from '../../middleware/auth'

const router=express.Router()


router.get('/:id',singleBrand)
router.get('/',allBrands)
router.post('/',authMiddleware, isAdmin,createBrand)
router.put('/:id',authMiddleware, isAdmin,editBrand)
router.delete('/:id',authMiddleware, isAdmin,deleteBrand)

export default router;