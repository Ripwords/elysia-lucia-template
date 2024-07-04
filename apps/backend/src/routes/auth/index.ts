import Elysia from "elysia"
import { signout } from "./signout"
import { signup } from "./signup"
import { signin } from "./signin"
import { verifyEmail } from "./email-verification"
import { forgotPassword } from "./forgot-password"

export const AuthController = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Authentication"],
  },
})
  .use(verifyEmail)
  .use(forgotPassword)
  .use(signup)
  .use(signin)
  .use(signout)
