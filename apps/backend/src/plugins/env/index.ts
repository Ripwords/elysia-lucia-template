import { z } from "zod"

// Ensures that the environment variables are correctly defined before the application starts
export const envSchema = z.object({
  SERVER_PORT: z.string().regex(/^\d+$/),
  WEBSITE_URL: z.string(),
  PASSWORD_PEPPER: z.string(),
  DATABASE_URL: z.string(),
  SMTP_USER: z.string().email(),
  SMTP_PASSWORD: z.string(),
  SMTP_HOST: z.string(),
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
