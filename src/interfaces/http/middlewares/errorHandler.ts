import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../../../shared/logger";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error({ err }, " - Error occurred");

  if (err instanceof Error && err.message === "Job not found") {
    return res.status(404).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: "Invalid request data", errors: err.issues });
  }

  if (err instanceof Error) {
    const msg = err.message || "";
    if (
      msg.includes("Invalid cursor") ||
      msg.includes("Invalid postedDate") ||
      msg.includes("must be between")
    ) {
      return res.status(400).json({ message: msg });
    }
  }

  return res.status(500).json({ message: "Internal server error" });
}
