import { Request, Response,NextFunction } from "express";
import { Users, validateUser } from "../user/user.model";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { sendEmail } from "../../utils/sendEmail";
import { UserType } from "../user/user.type";
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken";
import jwt from "jsonwebtoken";
import { errorMessage } from "../../utils/infoMessages";



export const googleCallback = async(req: Request, res: Response,next:NextFunction) => {
  try{
  const user = req.user as UserType;
  if (!user) {
      return res.status(401).json(errorMessage("User not found" ));
    }
  const accessToken = generateAccessToken(user.id!, user.role!);
  const refreshToken = generateRefreshToken(user.id!, user.role!);

  await Users.update({ refreshToken }, { where: { id: user.id } });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV ==="production" ? "strict":"lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV ==="production" ? "strict":"lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

 return  res.status(200).json({ message: "Login is successfull",accessToken, user });
}
catch(error){
  next(error)
}

}

export const register = async (req: Request, res: Response,next:NextFunction) => {
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

    const {fullname,email,phone}=req.body
    const user=await Users.create({
      fullname,
      email,
      phone,
      password:hashedPassword,
    })

    res.status(201).json({ message: "Register is successfull", data: user });
  } catch (error) {
    next(error)
    }
};

export const login = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const userInstance = await Users.findOne({ where: { email: req.body.email } });
    if (!userInstance) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userInstance.get() as UserType;

    if(user.registerMethod==="googleAuth"){
      return res.status(400).json({message:"This account was created with Google.Please log in with google"})
    }

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
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
      message: "Login is successfull",accessToken: accessToken });
  } catch (error) {
    next(error)
  }
};
export const refreshAccessToken = async (req: Request, res: Response,next:NextFunction) => {
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

export const logout = async (req: Request, res: Response,next:NextFunction) => {
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
    next(error)
  }
}


export const forgotPassword=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {email}=req.body
    if(!email){
      return res.status(400).json({message:"Email is required"})
    }
    const user=await Users.findOne({where:{email}})
    
    if(!user){
      return res.status(200).json({message:"If this email is registered, a password reset link has been sent"})
    }

    const currentUser=user.get() as UserType
    if(currentUser.registerMethod==="googleAuth"){
      return res.status(400).json({message:"This account uses Google login.Password reset is not available"})
    }
    const resetToken=crypto.randomBytes(32).toString("hex")
    const resetTokenExpires=new Date(Date.now()+15*60*1000)

    await user.update({
      resetPasswordToken:resetToken,
      resetPasswordExpires:resetTokenExpires
    })


    const resetLink=`${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`

    await sendEmail(email,"Password Reset Request",
    `<p>Click the link below to reset your password (valid for 15 minutes):</p>
   <a href="${resetLink}">${resetLink}</a>`
    )

    res.status(200).json({
    message:"If this email is registered, a password reset link has been sent"
    })

  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "token and newPassword are required "})
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "The new password must be at least 8 characters" });
    }

    const user = await Users.findOne({ where: { resetPasswordToken: token } });

    if (!user) {
      return res.status(400).json({ message: "The token is invalid or has already been used" });
    }

    const current = user.get() as UserType;

    if (!current.resetPasswordExpires || new Date(current.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ message: "The token has expired, please request a new one" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      refreshToken: null, 
    });

    res.status(200).json({ message: "Password successfully changed, you can now log in again" });
  } catch (error) {
    next(error)
  }
};