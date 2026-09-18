import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/connection";
import Joi from "joi";
import type { BasketAttributes } from "./basket.type";

interface BasketCreationAttributes extends Optional<BasketAttributes, "id"> {}

class Baskets extends Model<BasketAttributes, BasketCreationAttributes>
  implements BasketAttributes {
  public id!: number;
  public userId!: number;
  public products!: { productId: number; quantity: number; price: number }[];
  public totalAmount!: number;
}

Baskets.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "baskets" }
);

const validateBasket = (data: Partial<BasketAttributes>) => {
  const schema = Joi.object({
    userId: Joi.number().optional(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
      })
    ).optional(),
    totalAmount: Joi.number().optional(),
  });

  return schema.validate(data);
};

export { Baskets, validateBasket };