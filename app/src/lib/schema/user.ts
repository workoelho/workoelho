import { z } from "zod";

export const passwordSchema = z.string().min(12);

export const newUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: passwordSchema,
});
