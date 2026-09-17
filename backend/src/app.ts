import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shortlinkRoutes from "./routes/shortlink.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/shortlinks", shortlinkRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Shortlink API berjalan!",
  });
});

export default app;