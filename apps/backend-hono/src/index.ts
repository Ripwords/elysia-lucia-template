import { apiReference } from "@scalar/hono-api-reference"
import { envSchema } from "./plugins/env"
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi"
import { Route } from "./utils/openapiRoute"

envSchema.parse(process.env)

const app = new OpenAPIHono()

app.openapi(
  createRoute({
    method: "get",
    path: "/hello",
    responses: {
      200: {
        description: "Respond a message",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json({
      message: "Hello, World!",
    })
  }
)

app.get(
  "/ui",
  apiReference({
    spec: {
      url: "/doc",
    },
  })
)

app.doc("/doc", {
  info: {
    title: "An API",
    version: "v1",
  },
  openapi: "3.1.0",
})

export default {
  ...app,
  port: process.env.SERVER_PORT,
}

export type AppType = typeof app
