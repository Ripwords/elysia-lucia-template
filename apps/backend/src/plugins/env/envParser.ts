import { z } from "zod"

// Ensures that the environment variables are correctly defined before the application starts
export const envSchema = z.object({
  SERVER_PORT: z.string().regex(/^\d+$/),
  WEBSITE_URL: z.string(),
  PASSWORD_PEPPER: z.string(),
  DATABASE_URL: z.string(),
})
