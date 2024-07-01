import { UnifyErrorPlugin } from "@/lib/errors"
import { AuthController } from "@/routes/auth"
import { UsersController } from "@/routes/users"
import { treaty } from "@elysiajs/eden"
import { describe, expect, it, beforeAll } from "bun:test"
import { Elysia } from "elysia"

const app = new Elysia()
  .use(UnifyErrorPlugin)
  .use(AuthController)
  .use(UsersController)
const api = treaty(app)

let cookies: string[] = []
describe("Users", () => {
  beforeAll(async () => {
    const { response } = await api.auth.signin.post({
      email: "test@mail.com",
      password: "password",
    })
    cookies = response.headers.getSetCookie()
  })

  it("Get user details", async () => {
    const { data, error } = await api.users.me.get({
      fetch: {
        headers: {
          Cookie: cookies.toString(),
        },
      },
    })

    expect(data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: "test@mail.com",
        username: expect.any(String),
      })
    )
    expect(error?.value).toEqual(null || undefined)
  })
})
