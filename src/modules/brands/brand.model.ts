import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/connection";
import Joi from "joi";
import { BrandAttributes } from "./brand.type";

interface BrandCreationAttributes extends Optional<BrandAttributes, "id"> {}

class Brands extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes {
  public id!: number;
  public titleAz!: string;
  public titleRu!: string;
  public titleEn!: string; 
  public logo!: string;
}

Brands.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titleAz: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleRu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleEn: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "brands",
  }
);

const validateBrand = (data: Partial<BrandAttributes>) => {
  const schema = Joi.object({
    titleAz: Joi.string().trim().min(2).required(),
    titleRu: Joi.string().trim().min(2).required(),
    titleEn: Joi.string().trim().min(2).required(), 
    logo: Joi.string().required(),
  });

  return schema.validate(data);
};

export { Brands, validateBrand };