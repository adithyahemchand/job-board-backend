import { JobRepository } from "../../domain/job/JobRepository";
import { JobId } from "../../domain/job/JobId";
import { logger } from "../../shared/logger";

export class DeleteJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string): Promise<void> {
    const id = new JobId(jobId);

    const existingJob = await this.jobRepository.findJobById(id);
    if (!existingJob) {
      logger.error(`Attempted to delete non-existent job ID: ${jobId}`);
      throw new Error("Job not found");
    }

    await this.jobRepository.deleteJob(id);
    logger.info(`Deleted job ID: ${jobId}`);
  }
}
