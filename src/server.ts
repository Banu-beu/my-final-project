import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sequelize from "./config/connectdb";
import { Products } from "./modules/products/product.model";
import { setupSwagger } from "./swagger/swagger"; // Swagger importu

const app = express();
app.use(express.json());

setupSwagger(app);

import clientRoute from './routers/client';
app.use("/api/v1", clientRoute);


const adminBaseUrl = "/api/v1/ad";

import productRoute from "./modules/products/product.route";
app.use(`${adminBaseUrl}/product`, productRoute);


// (async () => {
//   await sequelize.sync({alter:true});
// })();


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
  console.log(`Swagger sənədləşməsi aktivdir: http://localhost:${PORT}/api-docs`);
});