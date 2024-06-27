import Elysia from "elysia"
import { signout } from "./signout"
import { signup } from "./signup"
import { userSignInDto } from "./dto/userSignIn.dto"
import { userSignIn } from "./repo/userSignIn"
import { signin } from "./signin"

export const AuthController = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Authentication"],
  },
})
  // Abstracted routes example
  .use(signup)
  .use(signin)
  .use(signout)
