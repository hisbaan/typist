import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().nonempty(),
})

export const config = EnvSchema.parse(process.env);
