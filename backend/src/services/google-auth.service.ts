import { Request, Response } from "express";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error(
    "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, atau GOOGLE_REDIRECT_URI belum diatur"
  );
}

const createGoogleOAuth2Client = () => {
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
};

export const getGoogleAuthorizationUrl = () => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET belum diatur");
  }

  const nonce = crypto.randomBytes(32).toString("hex");

  const state = jwt.sign(
    { nonce },
    jwtSecret,
    { expiresIn: "10m" }
  );

  const oauth2Client = createGoogleOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
    state,
  });
};

export const handleGoogleCallback = async (
  req: Request,
  res: Response
) => {
  try {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        message: "Code Google tidak ditemukan",
      });
    }

    if (!state || typeof state !== "string") {
      return res.status(400).json({
        message: "State Google tidak ditemukan",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET belum diatur");
    }

    try {
      jwt.verify(state, jwtSecret);
    } catch {
      return res.status(400).json({
        message: "State Google tidak valid atau sudah kedaluwarsa",
      });
    }

    const oauth2Client = createGoogleOAuth2Client();

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
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