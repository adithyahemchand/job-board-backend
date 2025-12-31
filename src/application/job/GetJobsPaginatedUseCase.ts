import { JobRepository } from "../../domain/job/JobRepository";
import { JobListDTO } from "./dto/JobListDTO";

const PAGE_SIZE = 10;

export class GetJobsPaginatedUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(
    cursor: { postedDate: Date; jobId: string } | null
  ): Promise<JobListDTO> {
    // Fetch one extra record to determine if more data exists
    const jobs = await this.jobRepository.findPaginated(cursor, PAGE_SIZE + 1);

    const hasMore = jobs.length > PAGE_SIZE;
    const pageItems = hasMore ? jobs.slice(0, PAGE_SIZE) : jobs;

    const lastJob =
      pageItems.length > 0 ? pageItems[pageItems.length - 1] : null;

    return {
      jobs: pageItems.map((job) => {
        const details = job.getDetails();
        return {
          jobId: details.jobId,
          title: details.title,
          author: details.author,
          postedDate: details.postedDate,
        };
      }),
      lastCursor: lastJob
        ? {
            postedDate: lastJob.getDetails().postedDate,
            jobId: lastJob.getDetails().jobId,
          }
        : null,
      loadMore: hasMore,
    };
  }
}
