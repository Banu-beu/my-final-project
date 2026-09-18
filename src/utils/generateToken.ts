import jwt from "jsonwebtoken";

export const generateAccessToken = (id: number, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (id: number, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: "7d",
    });
};