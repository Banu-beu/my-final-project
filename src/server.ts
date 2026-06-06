import express from "express";
import sequelize from "./config/connectdb";
import { Products } from "./modules/products/product.model";
import dotenv from "dotenv";
import { setupSwagger } from "./swagger/swagger"; // Swagger importu

dotenv.config();

const app = express();
app.use(express.json());

// Swagger-i işə salırıq (Bütün YAML-ları oxuyacaq)
setupSwagger(app);

import clientRoute from './routers/client';
app.use("/api/v1", clientRoute);


const adminBaseUrl = "/api/v1/ad";

import productRoute from "./modules/products/product.route";
app.use(`${adminBaseUrl}/product`, productRoute);


// (async () => {
//   await sequelize.sync({alter:true});
// })();


app.listen(3000, () => {
  console.log("Express app running on port 3000");
  console.log("Swagger sənədləşməsi aktivdir: http://localhost:3000/api-docs");
});