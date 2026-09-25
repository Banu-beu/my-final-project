import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";


import sequelize from "./config/connection";
import "./utils/passport"

import { relations } from "./relations/relation";
relations();

import authRoute from "./modules/auth/auth.route"
import productRoute from "./modules/products/product.route"
import categoryRoute from "./modules/categories/category.router"
import brandRoute from "./modules/brands/brand.route"
import userRoute from "./modules/user/user.router"
import basketRoute from './modules/basket/basket.route'
import orderRoute from './modules/order/order.route'
import favoriteRoute from './modules/favorites/favorite.route'
import blogRoute from'./modules/blog/blog.route'

import { setupSwagger } from "./swagger/swagger"; 
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";


const app = express();
app.use(cors({
  origin:process.env.CLIENT_URL ,
  credentials:true,
}))
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize())


setupSwagger(app);

app.use('/auth',authRoute)
app.use("/basket", basketRoute);
app.use("/order",orderRoute)
app.use("/user", userRoute); 
app.use("/product", productRoute);
app.use('/category',categoryRoute)
app.use('/brand',brandRoute);
app.use('/favorite',favoriteRoute);
app.use('/blog',blogRoute);

app.use(notFoundHandler)
app.use(errorHandler);

// (async () => {
//   await sequelize.sync({alter:true});
// })();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
  console.log(`Swagger sənədləşməsi aktivdir: http://localhost:${PORT}/api-docs`);
});