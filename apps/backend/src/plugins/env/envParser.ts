import { z } from "zod"

export const envSchema = z.object({
  SERVER_PORT: z.string().regex(/^\d+$/),
  WEBSITE_URL: z.string(),
  PASSWORD_PEPPER: z.string(),
  DATABASE_URL: z.string(),
})
