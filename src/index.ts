import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./infrastructure/database/mongo";

import cookieParser from "cookie-parser";
import { jobRoutes } from "./interfaces/http/routes/jobRoutes";
import { JobController } from "./interfaces/http/controllers/JobController";

import { CreateJobUseCase } from "./application/job/CreateJobUseCase";
import { UpdateJobUseCase } from "./application/job/UpdateJobUseCase";
import { GetJobByIdUseCase } from "./application/job/GetJobByIdUseCase";
import { GetJobsPaginatedUseCase } from "./application/job/GetJobsPaginatedUseCase";
import { DeleteJobUseCase } from "./application/job/DeleteJobUseCase";
import { MongoJobRepository } from "./infrastructure/job/MongoJobRepository";
import { errorHandler } from "./interfaces/http/middlewares/errorHandler";
import { corsMiddleware } from "./interfaces/http/middlewares/corsMiddleware";
import { logger } from "./shared/logger";

dotenv.config();

const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const jobRepo = new MongoJobRepository();

// Use cases
const createUseCase = new CreateJobUseCase(jobRepo);
const updateUseCase = new UpdateJobUseCase(jobRepo);
const getByIdUseCase = new GetJobByIdUseCase(jobRepo);
const getPaginatedUseCase = new GetJobsPaginatedUseCase(jobRepo);
const deleteUseCase = new DeleteJobUseCase(jobRepo);

// Controller
const jobController = new JobController(
  createUseCase,
  updateUseCase,
  getByIdUseCase,
  getPaginatedUseCase,
  deleteUseCase
);

app.use("/jobs", jobRoutes(jobController));
app.use(errorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

//Bootstrapping server after MongoDB connection
async function bootstrap() {
  try {
    await connectMongo();
    logger.info("MongoDB connected");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, ": Failed to start server");
    process.exit(1);
  }
}

bootstrap();

export { app };
