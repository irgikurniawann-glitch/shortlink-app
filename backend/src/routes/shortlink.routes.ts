import { Router } from "express";
import {
  createShortLink,
  redirectShortLink,
  updateShortLink,
  deleteShortLink,
  getShortLinks,
} from "../controllers/shortlink.controller";
const router = Router();

router.post("/", createShortLink);
router.put("/:code", updateShortLink);
router.delete("/:code", deleteShortLink);
router.get("/", getShortLinks);
router.get("/:code", redirectShortLink);

export default router;