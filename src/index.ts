import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./infrastructure/database/mongo";

dotenv.config();

const app = express();

connectMongo();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
