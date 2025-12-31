import { JobRepository } from "../../domain/job/JobRepository";
import { JobId } from "../../domain/job/JobId";
import { JobDetailsDTO } from "./dto/JobDetailsDTO";

export class GetJobByIdUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string): Promise<JobDetailsDTO | null> {
    const job = await this.jobRepository.findJobById(new JobId(jobId));
    if (!job) throw new Error("Job not found");

    return job.getDetails();
  }
}
