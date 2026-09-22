import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shortlinkRoutes from "./routes/shortlink.routes.js";

import googleAuthRoutes from "./routes/google-auth.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use("/api/shortlinks", shortlinkRoutes);
app.use("/api/auth", googleAuthRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Shortlink API berjalan!",
  });
});

export default app;