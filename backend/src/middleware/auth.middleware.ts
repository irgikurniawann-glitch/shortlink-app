import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Anda harus login terlebih dahulu",
      });
    }

    const token = authHeader.split(" ")[1];

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET belum diatur");
    }

    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded === "string" || !decoded.userId) {
      return res.status(401).json({
        message: "Token tidak valid",
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Token tidak valid atau sudah kedaluwarsa",
    });
  }
};