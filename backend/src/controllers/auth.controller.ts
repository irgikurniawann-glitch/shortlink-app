import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/email.service.js";

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

    await prisma.emailVerificationToken.deleteMany({
  where: {
    userId: user.id,
  },
});

const verificationToken = crypto.randomBytes(32).toString("hex");
await prisma.emailVerificationToken.create({
  data: {
    token: verificationToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
});
const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
  throw new Error("FRONTEND_URL belum diatur");
}

const verificationUrl =
  `${frontendUrl}/verify-email?token=${verificationToken}`;

await sendVerificationEmail(
  user.email,
  verificationUrl
);
    

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
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        message: "Token verifikasi tidak valid",
      });
    }

    const verificationToken =
      await prisma.emailVerificationToken.findUnique({
        where: {
          token,
        },
      });

    if (!verificationToken) {
      return res.status(400).json({
        message: "Token verifikasi tidak ditemukan",
      });
    }

    if (verificationToken.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Token verifikasi sudah kedaluwarsa",
      });
    }

    await prisma.user.update({
      where: {
        id: verificationToken.userId,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.emailVerificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });

    return res.json({
      message: "Email berhasil diverifikasi",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal melakukan verifikasi email",
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

    if (!user.password) {
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
       if (!user.emailVerified) {
      return res.status(403).json({
        message: "Email belum diverifikasi. Silakan cek email kamu.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET belum diatur");}

    const token = jwt.sign(
      {userId: user.id,
        email: user.email,}
      ,jwtSecret,{expiresIn: "7d",}
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