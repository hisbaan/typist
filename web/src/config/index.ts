import { z } from "zod";

const EnvSchema = z.object({
  BASE_URL: z.string().url().nonempty(),
  DATABASE_URL: z.string().nonempty(),
  WORKOS_CLIENT_ID: z.string().nonempty(),
  WORKOS_API_KEY: z.string().nonempty(),
  WORKOS_ORG_ID: z.string().nonempty(),
  WORKOS_COOKIE_PASSWORD: z.string().nonempty(),
  NEXT_PUBLIC_WORKOS_REDIRECT_URL: z.string().url().nonempty(),
})

export const config = EnvSchema.parse(process.env);
