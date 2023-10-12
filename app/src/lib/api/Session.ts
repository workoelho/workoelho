import { z } from "zod";
import { Password } from "~/lib/api/User";

export const New = z.object({
  email: z.string().email(),
  password: Password,
});
