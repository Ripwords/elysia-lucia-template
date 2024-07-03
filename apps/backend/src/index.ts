import { CronController } from "@/plugins/cron"
import { envSchema } from "@/plugins/env"
import { AuthController } from "@/routes/auth"
import { UsersController } from "@/routes/users"
import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import Elysia from "elysia"
import { Logestic } from "logestic"
import { UnifyErrorPlugin } from "./lib/errors"

// Ensures that environment variables are set
envSchema.parse(process.env)

const app = new Elysia()
  .use(Logestic.preset("fancy"))
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
  .use(UnifyErrorPlugin)
  .use(AuthController)
  .use(UsersController)
  .use(CronController)
  .listen(process.env.SERVER_PORT!, () => {
    console.log(
      `🦊 Elysia is running! http://localhost:${process.env.SERVER_PORT}/swagger`
    )
  })

export type App = typeof app
