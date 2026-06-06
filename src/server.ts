import dotenv from "dotenv";
// Dəyişənlər mütləq hər şeydən əvvəl yüklənməlidir!
dotenv.config();

import express from "express";
import sequelize from "./config/connectdb";
import { Products } from "./modules/products/product.model";
import { setupSwagger } from "./swagger/swagger"; // Swagger importu

const app = express();
app.use(express.json());

// Swagger-i işə salırıq (Bütün YAML-ları oxuyacaq)
setupSwagger(app);

import clientRoute from './routers/client';
app.use("/api/v1", clientRoute);


const adminBaseUrl = "/api/v1/ad";

import productRoute from "./modules/products/product.route";
app.use(`${adminBaseUrl}/product`, productRoute);


// Sənin sync koduna toxunulmadı, necə var elə də qaldı:
// (async () => {
//   await sequelize.sync({alter:true});
// })();


// Railway portu dinamik təyin edir, ona görə bura process.env.PORT yazdıq
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
  console.log(`Swagger sənədləşməsi aktivdir: http://localhost:${PORT}/api-docs`);
});