import { DataTypes, Model } from "sequelize";
import Joi from "joi";
import { UserType } from "./user.type";
import sequelize from "../../config/connection";

const Users = sequelize.define<Model<UserType, UserType>>("users", {
  fullname: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user",
  },
    registerMethod: {
    type: DataTypes.ENUM("form", "googleAuth"),
    allowNull: false,
    defaultValue: "form",
  },
  refreshToken: { type: DataTypes.TEXT, allowNull: true },
});

const validateUser = (data: Partial<UserType>) => {
  const schema = Joi.object({
    fullname: Joi.string().allow("", null).optional(),
    password: Joi.string().allow("", null).optional(),
    email: Joi.string().email().allow("", null).optional(),
    phone: Joi.string().allow("", null).optional(),
    role: Joi.string().valid("user", "admin").optional(),
    registerMethod: Joi.string().valid("form", "googleAuth").optional(),
    refreshToken: Joi.string().allow("", null).optional(),
  });

  return schema.validate(data);
};

export { Users, validateUser };