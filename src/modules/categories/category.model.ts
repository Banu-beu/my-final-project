import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/connection";
import Joi from "joi";
import { CategoryAttributes } from "./category.type";

interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id" | "slug"> {}

class Categories extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
  public id!: number;
  public slug!: string;
  public titleAz!: string;
  public titleRu!: string;
  public titleEn!: string;
}

Categories.init(
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
  },
  { 
    sequelize, 
    
    modelName: "categories" 
  }
);

const validateCategory = (data: Partial<CategoryAttributes>) => {
  const schema = Joi.object({
    slug: Joi.string().required(),
    titleAz: Joi.string().trim().min(2).required(),
    titleRu: Joi.string().trim().min(2).required(),
    titleEn: Joi.string().trim().min(2).required(),
  });

  return schema.validate(data);
};

export { Categories, validateCategory };