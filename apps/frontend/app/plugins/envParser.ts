import { z } from "zod"

export default defineNuxtPlugin(() => {
  const envSchema = z.object({
    VITE_SERVER_URL: z.string(),
  })

  try {
    envSchema.parse(import.meta.env)
  } catch {
    throw new Error("Invalid environment variables")
  }
})
