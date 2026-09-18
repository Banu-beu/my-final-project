import { Request, Response } from "express";
import { Users, validateUser } from "../user/user.model";
import bcrypt from "bcrypt";
import { UserType } from "../user/user.type";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken";
import jwt from "jsonwebtoken";



export const googleCallback = (req: Request, res: Response) => {
  const user = req.user as UserType;

  const accessToken = generateAccessToken(user.id!, user.role!);
  const refreshToken = generateRefreshToken(user.id!, user.role!);

  Users.update({ refreshToken }, { where: { id: user.id } });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Login is successfull", user });
};



export const register = async (req: Request, res: Response) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existUser = await Users.findOne({ where: { email: req.body.email } });
    if (existUser) {
      return res.status(400).json({ message: "This email is already exist" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await Users.create({ ...req.body, password: hashedPassword });

    res.status(201).json({ message: "Register is successfull", data: user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const userInstance = await Users.findOne({ where: { email: req.body.email } });
    if (!userInstance) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userInstance.get() as UserType;

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is wrong" });
    }

    const accessToken = generateAccessToken(user.id!, user.role!);
    const refreshToken = generateRefreshToken(user.id!, user.role!);

    await userInstance.update({ refreshToken });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
      message: "Login is successfull",
      accessToken: accessToken,
      refreshToken: refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not founded" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: number; role: string };

    const user = await Users.findOne({ where: { id: decoded.id, refreshToken } });
    if (!user) {
      return res.status(401).json({ message: "Refresh token is wrong" });
    }

    const accessToken = generateAccessToken(decoded.id, decoded.role);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Refresh token is wrong" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
  const user = await Users.findByPk((req as any).user?.id);
    if (user) {
      await user.update({ refreshToken: null });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout is successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Error", error });
  }
};