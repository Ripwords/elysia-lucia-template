import Elysia from "elysia"
import { signin } from "./signin"
import { signout } from "./signout"
import { signup } from "./signup"

export const AuthController = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Authentication"],
  },
})
  .use(signup)
  .use(signin)
  .use(signout)
