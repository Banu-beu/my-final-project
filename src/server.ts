import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import sequelize from "./config/connectdb";
import { Products } from "./modules/products/product.model";
import { setupSwagger } from "./swagger/swagger"; 

const app = express();

app.use(cors());
app.use(express.json());

// Ana səhifəyə (/) girəndə bura işə düşəcək
app.get("/", (req, res) => {
  res.send("<h1>Server canavar kimi işləyir! 🚀</h1><p>Swagger üçün <a href='/api-docs/'>bura klikləyin</a>.</p>");
});

setupSwagger(app);

import clientRoute from './routers/client';
app.use("/api/v1", clientRoute);

const adminBaseUrl = "/api/v1/ad";

import productRoute from "./modules/products/product.route";
app.use(`${adminBaseUrl}/product`, productRoute);

// Sənin sync kodun olduğu kimi qaldı:
// (async () => {
//   await sequelize.sync({alter:true});
// })();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Express app running on port ${PORT}`);
});