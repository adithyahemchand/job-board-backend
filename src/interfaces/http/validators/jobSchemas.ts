import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
});

export const updateJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const paginationQuerySchema = z.object({
  cursor: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return null;
      try {
        const parsed = JSON.parse(val);
        // Validate shape
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          typeof parsed.postedDate === "string" &&
          typeof parsed.jobId === "string"
        ) {
          const date = new Date(parsed.postedDate);
          if (Number.isNaN(date.getTime())) {
            throw new Error("Invalid postedDate in cursor");
          }
          return { postedDate: date, jobId: parsed.jobId };
        }
        throw new Error("Invalid cursor format");
      } catch (e) {
        throw new Error("Invalid cursor format");
      }
    }),
});
