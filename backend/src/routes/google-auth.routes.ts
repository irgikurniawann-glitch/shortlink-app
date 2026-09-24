import { Router } from "express";

import { authRateLimit } from "../middleware/rate-limit.middleware.js";

import {
  getGoogleAuthorizationUrl,
  handleGoogleCallback,
} from "../services/google-auth.service.js";

import {
  register,
  verifyEmail,
  login,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authRateLimit, register);

router.get("/verify-email", verifyEmail);

router.post("/login", authRateLimit, login);

router.get("/google", authRateLimit, (req, res) => {
  const authorizationUrl = getGoogleAuthorizationUrl();

  return res.redirect(authorizationUrl);
});

router.get("/google/callback", handleGoogleCallback);

export default router;