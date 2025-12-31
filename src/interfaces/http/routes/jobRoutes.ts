import { Router } from "express";
import { JobController } from "../controllers/JobController";
import { authorizeRole } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createJobSchema,
  updateJobSchema,
  paginationQuerySchema,
} from "../validators/jobSchemas";

export function jobRoutes(controller: JobController): Router {
  const router = Router();

  // Admin-only
  router.post(
    "/",
    authorizeRole(["admin"]),
    validateRequest(createJobSchema, "body"),
    controller.createJobHandler
  );

  router.put(
    "/:id",
    authorizeRole(["admin"]),
    validateRequest(updateJobSchema, "body"),
    controller.updateJobHandler
  );

  router.delete("/:id", authorizeRole(["admin"]), controller.deleteJobHandler);

  // All users
  router.get(
    "/",
    validateRequest(paginationQuerySchema, "query"),
    controller.getJobsPaginatedHandler
  );

  router.get("/:id", controller.getJobByIdHandler);

  return router;
}
