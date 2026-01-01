import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Simple request validation middleware using zod.
 * Validates request body or query before reaching controller.
 */
export function validateRequest(schema: ZodSchema, source: "body" | "query") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: result.error.issues,
      });
    }

    if (source === "body") {
      req[source] = result.data;
    } else if (source === "query") {
      try {
        Object.assign(req.query as any, result.data);
      } catch (e) {}
    }
    next();
  };
}
