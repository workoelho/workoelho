import { z } from "zod";

export const name = z.string().min(1);
export const email = z.string().email();
export const password = z.string().min(12);
