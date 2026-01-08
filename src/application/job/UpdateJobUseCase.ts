import { JobRepository } from "../../domain/job/JobRepository";
import { JobId } from "../../domain/job/JobId";
import { JobUpdateDTO } from "./dto/JobUpdateDTO";
import { logger } from "../../shared/logger";

export class UpdateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(jobId: string, dto: JobUpdateDTO): Promise<void> {
    const id = new JobId(jobId);
    const job = await this.jobRepository.findJobById(id);

    if (!job) {
      logger.error(`Attempted to update non-existent job ID: ${jobId}`);
      throw new Error("Job not found");
    }

    // Domain mutation — repository only persists final state
    job.updateDetails(dto.title, dto.description);

    logger.info(`Updated job ID: ${jobId}`);
    await this.jobRepository.saveJob(job);
  }
}
