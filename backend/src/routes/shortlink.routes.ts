import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { register } from "../controllers/auth.controller";
import {
  createShortLink,
  redirectShortLink,
  updateShortLink,
  deleteShortLink,
  getShortLinks,
} from "../controllers/shortlink.controller";
import { login } from "../controllers/auth.controller";
const router = Router();

router.post("/", authMiddleware, createShortLink);
router.put("/:code", authMiddleware, updateShortLink);
router.delete("/:code", authMiddleware, deleteShortLink);
router.get("/", authMiddleware, getShortLinks);
router.get("/:code", redirectShortLink);
router.post("/register", register);
router.post("/login", login);
export default router;