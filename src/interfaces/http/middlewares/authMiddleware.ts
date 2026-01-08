import { Request, Response, NextFunction } from "express";
import { logger } from "../../../shared/logger";

// Role is stored in cookie: "role" = "admin" | "user"
export function authorizeRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.cookies?.role;
    if (!role || !allowedRoles.includes(role)) {
      logger.warn(`Unauthorized access attempt with role: ${role}`);
      return res.status(403).json({ message: "Forbidden" });
    }
    logger.info(`Access granted for role: ${role}`);
    next();
  };
}
