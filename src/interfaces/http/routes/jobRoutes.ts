import { Router } from "express";
import { JobController } from "../controllers/JobController";
import { authorizeRole } from "../middlewares/authMiddleware";

export function jobRoutes(controller: JobController): Router {
  const router = Router();

  // Admin-only
  router.post("/", authorizeRole(["admin"]), controller.createJobHandler);
  router.put("/:id", authorizeRole(["admin"]), controller.updateJobHandler);
  router.delete("/:id", authorizeRole(["admin"]), controller.deleteJobHandler);

  // All users
  router.get("/", controller.getJobsPaginatedHandler);
  router.get("/:id", controller.getJobByIdHandler);

  return router;
}
