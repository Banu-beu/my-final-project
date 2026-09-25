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
  bonusPoints: {type:DataTypes.INTEGER,allowNull:false,defaultValue:0},
  image: {type:DataTypes.STRING,allowNull:true},
  resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
  resetPasswordExpires: { type: DataTypes.DATE, allowNull: true }
  
});

const validateUser = (data: Partial<UserType>) => {
  const schema = Joi.object({
    fullname: Joi.string().min(2).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow("", null).optional(),
    role: Joi.string().valid("user", "admin").optional(),
    registerMethod: Joi.string().valid("form", "googleAuth").optional(),
    refreshToken: Joi.string().allow("", null).optional(),
    bonusPoints:Joi.number().integer().min(0).optional(),
    image:Joi.string().allow("",null).optional(),
    resetPasswordToken:Joi.string().allow("",null).optional(),
    resetPasswordExpires:Joi.date().allow(null).optional()
  });

  return schema.validate(data);
};

const validateUserUpdate = (data: Partial<UserType>) => {
  const schema = Joi.object({
    fullname: Joi.string().min(2).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().allow("", null).optional(),
    role: Joi.string().valid("user", "admin").optional(),
  });

  return schema.validate(data);
};

export { Users, validateUser,validateUserUpdate };