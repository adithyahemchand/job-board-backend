import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err);

  if (err.message === "Job not found") {
    return res.status(404).json({ message: err.message });
  }

  return res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
}
