import { Request, Response, NextFunction } from "express";

// Role is stored in cookie: "role" = "admin" | "user"
export function authorizeRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.cookies?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
