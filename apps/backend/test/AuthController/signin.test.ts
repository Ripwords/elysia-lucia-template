import { UnifyErrorPlugin } from "@/lib/errors"
import { AuthController } from "@/routes/auth"
import { treaty } from "@elysiajs/eden"
import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"
import { errMsg } from "../testUtil"

const app = new Elysia().use(UnifyErrorPlugin).use(AuthController)
const api = treaty(app)

describe("Sign In", () => {
  it("signin with correct credentials", async () => {
    const { data, error } = await api.auth.signin.post({
      email: "test@mail.com",
      password: "password",
    })

    expect(data).toEqual({
      id: expect.any(String),
      email: "test@mail.com",
      username: "test",
    })
    expect(error?.value).toEqual(null || undefined)
  })

  it("signin with incorrect credentials", async () => {
    const { data, error } = await api.auth.signin.post({
      email: "test@mail.com",
      password: "password1",
    })

    expect(data).toEqual(null)
    expect(error?.value).toEqual(errMsg("Unauthorized"))
  })

  it("signin with missing credentials", async () => {
    const { data, error } = await api.auth.signin.post({
      email: "test@mail.com",
      password: "",
    })

    expect(data).toEqual(null)
    expect(error?.value).toEqual(errMsg("Bad Request"))
  })
})
