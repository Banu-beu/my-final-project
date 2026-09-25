import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/connection";
import Joi from "joi";
import type { OrderAttributes } from "./order.type";

interface OrderCreationAttributes extends Optional<OrderAttributes, "id"> {}

class Orders extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public address!: string;
  public products!: {productId: number; quantity: number; price:number }[]
  public totalAmount!: number;
  public status!: "pending" | "confirmed" | "delivered" | "cancelled";
}

Orders.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    products:{
      type:DataTypes.JSON,
      allowNull:false,
      defaultValue:[],
      get(){
        const raw=this.getDataValue("products");
        if(typeof raw==="string"){
          try {
            return JSON.parse(raw)
          } catch {
            return []
          }
        }
        return raw || []
      },
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  { sequelize, modelName: "orders" }
);

const validateOrder = (data: Partial<OrderAttributes>) => {
  const schema = Joi.object({
    userId: Joi.number().optional(),
    address: Joi.string().allow("", null).optional(),
    products:Joi.array().items(
      Joi.object({
        productId:Joi.number().required(),
        quantity:Joi.number().required(),
        price:Joi.number().required()
      })
    ).optional(),
    totalAmount: Joi.number().optional(),
    status: Joi.string().valid("pending", "confirmed", "delivered", "cancelled").optional(),
  });

  return schema.validate(data);
};

export { Orders, validateOrder };