import { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET belum diatur");
}

export const googleOAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  "http://localhost:4000/api/auth/google/callback"
);

export const getGoogleAuthorizationUrl = () => {
  return googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "openid",
      "email",
      "profile",
    ],
    prompt: "select_account",
  });
};

export const handleGoogleCallback = async (
  req: Request,
  res: Response
) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        message: "Code Google tidak ditemukan",
      });
    }

    const { tokens } = await googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: googleOAuth2Client,
      version: "v2",
    });

    const { data: googleUser } = await oauth2.userinfo.get();

    if (!googleUser.email) {
      return res.status(400).json({
        message: "Email Google tidak ditemukan",
      });
    }

    if (!googleUser.verified_email) {
      return res.status(403).json({
        message: "Email Google belum terverifikasi",
      });
    }
    
    if (!googleUser.id) {
  return res.status(400).json({
    message: "ID Google tidak ditemukan",
  });
}

    let user = await prisma.user.findUnique({
      where: {
        googleId: googleUser.id,
      },
    });

    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          email: googleUser.email,
        },
      });
    }

    if (user) {
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          googleId: googleUser.id,
          emailVerified: true,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          password: null,
          googleId: googleUser.id,
          emailVerified: true,
        },
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

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL belum diatur");
    }

    return res.redirect(
      `${frontendUrl}/auth/google/callback?token=${encodeURIComponent(token)}`
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Gagal melakukan login dengan Google",
    });
  }
};