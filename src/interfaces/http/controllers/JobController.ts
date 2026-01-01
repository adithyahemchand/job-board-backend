import { Request, Response } from "express";
import { CreateJobUseCase } from "../../../application/job/CreateJobUseCase";
import { UpdateJobUseCase } from "../../../application/job/UpdateJobUseCase";
import { GetJobByIdUseCase } from "../../../application/job/GetJobByIdUseCase";
import { GetJobsPaginatedUseCase } from "../../../application/job/GetJobsPaginatedUseCase";
import { DeleteJobUseCase } from "../../../application/job/DeleteJobUseCase";

export class JobController {
  constructor(
    private readonly createJob: CreateJobUseCase,
    private readonly updateJob: UpdateJobUseCase,
    private readonly getJobById: GetJobByIdUseCase,
    private readonly getJobsPaginated: GetJobsPaginatedUseCase,
    private readonly deleteJob: DeleteJobUseCase
  ) {}

  createJobHandler = async (req: Request, res: Response, next: any) => {
    try {
      await this.createJob.execute(req.body);
      res.status(201).json({ message: "Job created" });
    } catch (error) {
      next(error);
    }
  };

  updateJobHandler = async (req: Request, res: Response, next: any) => {
    try {
      await this.updateJob.execute(req.params.id, req.body);
      res.status(200).json({ message: "Job updated" });
    } catch (error) {
      next(error);
    }
  };

  getJobByIdHandler = async (req: Request, res: Response, next: any) => {
    try {
      const job = await this.getJobById.execute(req.params.id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  };

  getJobsPaginatedHandler = async (req: Request, res: Response, next: any) => {
    try {
      let cursor = null;

      if (req.query.cursor) {
        if (typeof req.query.cursor === "string") {
          cursor = JSON.parse(req.query.cursor as string);
        } else {
          cursor = req.query.cursor as any;
        }
      }

      const jobs = await this.getJobsPaginated.execute(cursor);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  };

  deleteJobHandler = async (req: Request, res: Response, next: any) => {
    try {
      await this.deleteJob.execute(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
