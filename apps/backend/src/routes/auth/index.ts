import Elysia from "elysia"
import { signout } from "./signout"
import { signup } from "./signup"
import { signin } from "./signin"
import { verifyEmail } from "./verifyEmail"
import { sendVerification } from "./sendVerification"

export const AuthController = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Authentication"],
  },
})
  .use(verifyEmail)
  .use(sendVerification)
  .use(signup)
  .use(signin)
  .use(signout)
