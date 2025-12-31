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
    await this.createJob.execute(req.body);
    res.status(201).json({ message: "Job created" });
  };

  updateJobHandler = async (req: Request, res: Response) => {
    await this.updateJob.execute(req.params.id, req.body);
    res.status(200).json({ message: "Job updated" });
  };

  getJobByIdHandler = async (req: Request, res: Response) => {
    const job = await this.getJobById.execute(req.params.id);
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.status(200).json(job);
  };

  getJobsPaginatedHandler = async (req: Request, res: Response) => {
    let cursor = null;

    if (req.query.cursor) {
      cursor = JSON.parse(req.query.cursor as string);
    }

    const jobs = await this.getJobsPaginated.execute(cursor);
    res.status(200).json(jobs);
  };

  deleteJobHandler = async (req: Request, res: Response) => {
    await this.deleteJob.execute(req.params.id);
    res.status(204).send();
  };
}
