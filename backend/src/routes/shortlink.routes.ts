import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authRateLimit } from "../middleware/rate-limit.middleware.js";
import {
  register,
  login,
  verifyEmail,
} from "../controllers/auth.controller.js";
import {
  createShortLink,
  redirectShortLink,
  updateShortLink,
  deleteShortLink,
  getShortLinks,
} from "../controllers/shortlink.controller.js";

const router = Router();

router.post("/", authMiddleware, createShortLink);
router.put("/:code", authMiddleware, updateShortLink);
router.delete("/:code", authMiddleware, deleteShortLink);
router.get("/", authMiddleware, getShortLinks);

router.get("/verify-email", authRateLimit, verifyEmail);

router.get("/:code", redirectShortLink);

router.post("/register", authRateLimit, register);
router.post("/login", authRateLimit, login);

export default router;