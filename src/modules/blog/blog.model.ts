import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/connection";
import Joi from "joi";
import { BlogAttributes } from "./blog.type";

interface BlogCreationAttributes extends Optional<BlogAttributes, "id"> {}

class Blogs extends Model<BlogAttributes, BlogCreationAttributes>
  implements BlogAttributes {
  public id!: number;
  public slug!: string;
  public coverImage!: string;
  public titleAz!: string;
  public titleRu!: string;
  public titleEn!: string;
  public contentAz!: string;
  public contentRu!: string;
  public contentEn!: string;
}

Blogs.init(
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
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
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
    contentAz: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentRu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contentEn: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize, modelName: "blogs" }
);

const validateBlog = (data: Partial<BlogAttributes>) => {
  const schema = Joi.object({
    slug: Joi.string().optional(),
    coverImage: Joi.string().optional(),
    titleAz: Joi.string().optional(),
    titleRu: Joi.string().optional(),
    titleEn: Joi.string().optional(),
    contentAz: Joi.string().optional(),
    contentRu: Joi.string().optional(),
    contentEn: Joi.string().optional(),
  });

  return schema.validate(data);
};

export { Blogs, validateBlog };