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

  createJobHandler = async (req: Request, res: Response) => {
    try {
      await this.createJob.execute(req.body);
      res.status(201).json({ message: "Job created" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  updateJobHandler = async (req: Request, res: Response) => {
    try {
      await this.updateJob.execute(req.params.id, req.body);
      res.status(200).json({ message: "Job updated" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getJobByIdHandler = async (req: Request, res: Response) => {
    try {
      const job = await this.getJobById.execute(req.params.id);
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }
      res.status(200).json(job);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  getJobsPaginatedHandler = async (req: Request, res: Response) => {
    try {
      let cursor = null;

      if (req.query.cursor) {
        cursor = JSON.parse(req.query.cursor as string);
      }

      const jobs = await this.getJobsPaginated.execute(cursor);
      res.status(200).json(jobs);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  deleteJobHandler = async (req: Request, res: Response) => {
    try {
      await this.deleteJob.execute(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      if (err.message === "Job not found") {
        res.status(404).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
