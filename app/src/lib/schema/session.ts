import { z } from "zod";
import { passwordSchema } from "~/lib/api/user";

export const newSessionSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
