import { JobRepository } from "../../domain/job/JobRepository";
import { Job } from "../../domain/job/Job";
import { JobId } from "../../domain/job/valueObjects/JobId";
import { JobCreateDTO } from "./dto/JobCreateDTO";
import { logger } from "../../shared/logger";
import { JobTitle } from "../../domain/job/valueObjects/JobTitle";
import { JobAuthor } from "../../domain/job/valueObjects/JobAuthor";
import { JobDescription } from "../../domain/job/valueObjects/JobDescription";

export class CreateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(dto: JobCreateDTO): Promise<void> {
    const job = new Job(
      JobId.generate(),
      JobTitle.create(dto.title),
      JobAuthor.create(dto.author),
      new Date(),
      JobDescription.create(dto.description)
    );

    await this.jobRepository.saveJob(job);
    logger.info(`Job created with ID: ${job.getId().toString()}`);
  }
}
