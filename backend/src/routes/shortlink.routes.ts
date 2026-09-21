import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
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
router.get("/verify-email", verifyEmail);
router.get("/:code", redirectShortLink);
router.post("/register", register);
router.post("/login", login);
export default router;