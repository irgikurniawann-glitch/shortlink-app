import { Router } from "express";
import { authRateLimit } from "../middleware/rate-limit.middleware.js";
import {
  getGoogleAuthorizationUrl,
  handleGoogleCallback,
} from "../services/google-auth.service.js";

const router = Router();

router.get("/google", authRateLimit, (req, res) => {
  const authorizationUrl = getGoogleAuthorizationUrl();

  return res.redirect(authorizationUrl);
});

router.get("/google/callback", handleGoogleCallback);

export default router;