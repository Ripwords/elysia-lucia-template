import { createRoute, OpenAPIHono, RouteConfig } from "@hono/zod-openapi"
import { Context } from "hono"

type RouteResponse = {
  [key: number]: {
    description: string
    content: {
      [key: string]: {
        schema: any
      }
    }
  }
}

type Method = Omit<RouteConfig, "path">["method"]

export class Route {
  private method: Method
  private path: string
  private responses: RouteResponse = {}
  private callback: (c: Context) => any = () => {}

  constructor(method: Method, path: string) {
    this.method = method
    this.path = path
  }

  public response(rsp: RouteResponse) {
    // Check if key is already present
    if (Object.keys(this.responses).includes(Object.keys(rsp)[0])) {
      throw new Error("Response key already exists")
    }
    this.responses = { ...this.responses, ...rsp }
    return this
  }

  public create(app: OpenAPIHono, callback: (c: Context) => keyof typeof this.responses[0]["content"]) {
    this.callback = callback
    app.openapi(
      createRoute({
        method: this.method,
        path: this.path,
        responses: this.responses,
      }),
      this.callback
    )
  }
}
