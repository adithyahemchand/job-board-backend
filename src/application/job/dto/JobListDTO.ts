export interface JobListDTO {
  jobs: Array<{
    jobId: string;
    title: string;
    author: string;
    postedDate: Date;
  }>;
  lastCursor: {
    postedDate: Date;
    jobId: string;
  } | null;
  loadMore: boolean;
}
