import { Products } from "../modules/products/product.model";
import { Categories } from "../modules/categories/category.model";
import { Brands } from "../modules/brands/brand.model";

export const relations = () => {
  Categories.hasMany(Products, { foreignKey: "categoryId", as: "products" });
  Products.belongsTo(Categories, { foreignKey: "categoryId", as: "category" });

  Brands.hasMany(Products, { foreignKey: "brandId", as: "products" });
  Products.belongsTo(Brands, { foreignKey: "brandId", as: "brand" });
};