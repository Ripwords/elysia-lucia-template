import { CronController } from "@/plugins/cron"
import { envSchema } from "@/plugins/env"
import { AuthController } from "@/routes/auth"
import { UsersController } from "@/routes/users"
import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import Elysia from "elysia"
import { UnifyErrorPlugin } from "./lib/errors"
import { logger } from "./plugins/logger"

// Ensures that environment variables are set
envSchema.parse(process.env)
const baseURL = `http://localhost:${process.env.SERVER_PORT}`

const app = new Elysia()
  .use(logger)
  .use(
    cors({
      origin: process.env.WEBSITE_URL,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    swagger({
      documentation: {
        servers: [{ url: baseURL }],
        tags: [
          {
            name: "Authentication",
            description: "Endpoints for authentication",
          },
          {
            name: "Users",
            description: "Endpoints for users",
          },
        ],
      },
    })
  )
  .use(UnifyErrorPlugin)
  .use(AuthController)
  .use(UsersController)
  .use(CronController)
  .listen(process.env.SERVER_PORT!, () => {
    console.log(
      `🦊 Elysia is running! ${baseURL}/swagger`
    )
  })

export type App = typeof app
