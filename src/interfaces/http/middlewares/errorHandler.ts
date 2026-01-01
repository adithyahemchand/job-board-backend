import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err);

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
    if (msg.includes("Invalid cursor") || msg.includes("Invalid postedDate")) {
      return res.status(400).json({ message: msg });
    }
  }

  return res.status(500).json({ message: "Internal server error" });
}
