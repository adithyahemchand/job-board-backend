import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const frontendOrigin = process.env.FRONTEND_ORIGIN;

if (!frontendOrigin) {
  throw new Error("FRONTEND_ORIGIN is not defined in environment variables");
}

export const corsMiddleware = cors({
  origin: frontendOrigin,
  credentials: true, // required for cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
});
