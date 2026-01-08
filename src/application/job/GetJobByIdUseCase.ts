import { JobRepository } from "../../domain/job/JobRepository";
import { JobId } from "../../domain/job/JobId";
import { JobDetailsDTO } from "./dto/JobDetailsDTO";
import { logger } from "../../shared/logger";

export class GetJobByIdUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string): Promise<JobDetailsDTO | null> {
    let id: JobId;
    try {
      id = new JobId(jobId);
    } catch {
      throw new Error("Job not found");
    }
    const job = await this.jobRepository.findJobById(new JobId(jobId));
    if (!job) throw new Error("Job not found");

    logger.info(`Returning details for job ID: ${jobId}`);
    return job.getDetails();
  }
}
