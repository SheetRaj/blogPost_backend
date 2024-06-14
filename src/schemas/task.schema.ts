import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().nonempty({
    message: "Title is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
});

export type createTaskType = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export type updateTaskType = z.infer<typeof updateTaskSchema>;
