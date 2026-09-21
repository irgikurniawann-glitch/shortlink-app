import { Router } from "express";
import {
  getGoogleAuthorizationUrl,
  handleGoogleCallback,
} from "../services/google-auth.service.js";

const router = Router();

router.get("/google", (req, res) => {
  const authorizationUrl = getGoogleAuthorizationUrl();

  return res.redirect(authorizationUrl);
});

router.get("/google/callback", handleGoogleCallback);

export default router;