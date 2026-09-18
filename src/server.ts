import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";


import sequelize from "./config/connection";
import "./utils/passport"
import { Categories } from "./modules/categories/category.model";
import { Products } from "./modules/products/product.model";
import { relations } from "./relations/relation";
relations();

import authRoute from "./modules/auth/auth.route"
import googleAuthRoute from "./modules/auth/auth.route"
import productRoute from "./modules/products/product.route";
import categoryRoute from "./modules/categories/category.router";
import brandRoute from "./modules/brands/brand.route";
import userRoute from "./modules/user/user.router";
import basketRoute from './modules/basket/basket.route';

import { setupSwagger } from "./swagger/swagger"; 



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize())


setupSwagger(app);

app.use('/auth',authRoute)
app.use('/google/auth',googleAuthRoute)
app.use("/basket", basketRoute);
app.use("/user", userRoute); 
app.use("/product", productRoute);
app.use('/category',categoryRoute)
app.use('/brand',brandRoute);


// (async () => {
//   await sequelize.sync({alter:true});
// })();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
  console.log(`Swagger sənədləşməsi aktivdir: http://localhost:${PORT}/api-docs`);
});