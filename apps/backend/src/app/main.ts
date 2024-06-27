import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import Elysia from "elysia"
import { SessionCleaner } from "../plugins/cron"
import { envSchema } from "../plugins/env"
import { AuthController } from "./auth/auth"
import { UsersController } from "./users"
import { pluginUnifyElysia } from "unify-elysia"

// Ensures that environment variables are set
envSchema.parse(process.env)

const app = new Elysia()
  .use(
    cors({
      origin: process.env.WEBSITE_URL!,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    swagger({
      documentation: {
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
  .use(pluginUnifyElysia())
  .use(AuthController)
  .use(UsersController)
  .use(SessionCleaner)
  .listen(process.env.SERVER_PORT!)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

export type App = typeof app
