import { JobRepository } from "../../domain/job/JobRepository";
import { logger } from "../../shared/logger";
import { JobListDTO } from "./dto/JobListDTO";

const PAGE_SIZE = 10;

export class GetJobsPaginatedUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(
    cursor: { postedDate: Date; jobId: string } | null
  ): Promise<JobListDTO> {
    const safeLimit = PAGE_SIZE <= 0 ? 10 : Math.min(PAGE_SIZE, 20);

    // Fetch one extra record to determine if more data exists
    const jobs = await this.jobRepository.findPaginated(cursor, safeLimit + 1);

    const hasMore = jobs.length > safeLimit;
    const pageItems = hasMore ? jobs.slice(0, safeLimit) : jobs;

    if (pageItems.length === 0) {
      logger.info("Returning empty job list.");
      return {
        jobs: [],
        lastCursor: null,
        loadMore: false,
      };
    }

    const lastJob = pageItems[pageItems.length - 1];

    logger.info("Returning paginated job list.");
    return {
      jobs: pageItems.map((job) => {
        return {
          jobId: job.getId().toString(),
          title: job.getTitle().getValue(),
          author: job.getAuthor().getValue(),
          postedDate: job.getPostedDate(),
        };
      }),
      lastCursor: lastJob
        ? {
            postedDate: lastJob.getPostedDate(),
            jobId: lastJob.getId().toString(),
          }
        : null,
      loadMore: hasMore,
    };
  }
}
