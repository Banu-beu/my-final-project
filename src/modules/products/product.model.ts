import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/connectdb";
import Joi from "joi";
import { ProductAttributes } from "./product.type";



interface ProductCreationAttributes extends Optional<ProductAttributes, "id" | "rating" | "reviewCount" | "isAction"> {}

class Products extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes {
  public id!: number;
  public slug!: string;
  //public images!: string;
  public titleAz!: string;
  public titleRu!: string;
  public titleEn!: string;
  public descriptionAz!: string | null;
  public descriptionEn!: string | null;
  public descriptionRu!: string | null;
  public price!: number;
  public discountPrice!: number | null;
  //public categoryId!: number;
  //public brandId!: number;
  public stock!: number;
  public installmentPrice!: number;
  //public installmentMonths!: string;
  public isAction!: boolean;
  public actionTextAz!: string | null;
  public actionTextEn!: string | null;
  public actionTextRu!: string | null;
  public rating!: number;
  public reviewCount!: number;
}

Products.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // images: { 
    //   type: DataTypes.TEXT, 
    //   allowNull: false 
    // },
    titleAz: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    titleRu: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    titleEn: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    descriptionAz: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    descriptionEn: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    descriptionRu: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    price: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    discountPrice: { 
      type: DataTypes.INTEGER, 
      allowNull: true, 
      defaultValue: null 
     },
    // categoryId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // brandId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    stock: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 0 
    },
    installmentPrice: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    // installmentMonths: { 
    //   type: DataTypes.STRING, 
    //   allowNull: false 
    // },
    isAction: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    actionTextAz: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actionTextRu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    actionTextEn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "products" }
);

const validateProduct = (data: Partial<ProductAttributes>) => {
  const schema = Joi.object({
    slug: Joi.string().required(),
    //images: Joi.array().items(Joi.string()).required(),
    titleAz: Joi.string().required(),
    titleRu: Joi.string().required(),
    titleEn: Joi.string().required(),
    descriptionAz: Joi.string().allow("", null).optional(),
    descriptionEn: Joi.string().allow("", null).optional(),
    descriptionRu: Joi.string().allow("", null).optional(),    
    price: Joi.number().positive().required(),
    discountPrice: Joi.number().positive().allow(null).optional(),
    //categoryId: Joi.number().integer().required(),
    //brandId: Joi.number().integer().required(),
    stock: Joi.number().integer().min(0).required(),
    installmentPrice: Joi.number().positive().required(),
   // installmentMonths: Joi.array().items(Joi.number().integer()).required(),
    isAction: Joi.boolean().optional(),
    actionTextAz: Joi.string().allow("", null).optional(),
    actionTextRu: Joi.string().allow("", null).optional(),
    actionTextEn: Joi.string().allow("", null).optional(),
    rating: Joi.number().min(0).max(5).optional(),
    reviewCount: Joi.number().integer().min(0).optional(),
  });

  return schema.validate(data);
};

export { Products, validateProduct };