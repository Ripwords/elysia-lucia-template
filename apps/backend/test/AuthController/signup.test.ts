import { UnifyErrorPlugin } from "@/lib/errors"
import { AuthController } from "@/routes/auth"
import { treaty } from "@elysiajs/eden"
import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"
import { errMsg } from "../testUtil"

const app = new Elysia().use(UnifyErrorPlugin).use(AuthController)
const api = treaty(app)

describe("Sign Up", () => {
  it("signup with existing email", async () => {
    const { data, error } = await api.auth.signup.post({
      email: "test@mail.com",
      password: "password",
      confirmPassword: "password",
      username: "test",
    })

    expect(data).toEqual(null)
    expect(error?.value).toEqual(errMsg("Bad Request"))
  })

  it("signup with mismatched passwords", async () => {
    const { data, error } = await api.auth.signup.post({
      confirmPassword: "password",
      email: "test1@mail.com",
      password: "password1",
      username: "test",
    })

    expect(data).toEqual(null)
    expect(error?.value).toEqual(errMsg("Bad Request"))
  })
})
