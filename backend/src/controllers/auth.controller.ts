import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
      
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal melakukan registrasi",
    });
  }
};
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET belum diatur");
}

const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
  },
  jwtSecret,
  {
    expiresIn: "7d",
  }
);
   return res.json({
  message: "Login berhasil",
  data: {
    id: user.id,
    email: user.email,
    token,
  },
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal melakukan login",
    });
  }
};