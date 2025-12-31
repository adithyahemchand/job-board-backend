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
    .transform((val) => (val ? JSON.parse(val) : null)),
});
