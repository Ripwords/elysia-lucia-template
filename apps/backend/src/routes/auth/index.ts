import Elysia from "elysia"
import { signout } from "./signout"
import { signup } from "./signup"
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
