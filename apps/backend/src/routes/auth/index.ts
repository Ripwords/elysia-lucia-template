import Elysia from "elysia"
import { signout } from "./signout"
import { signup } from "./signup"
import { userSignInDto } from "./dto/userSignIn.dto"
import { userSignIn } from "./repo/userSignIn"

export const AuthController = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Authentication"],
  },
})
  // Abstracted routes example
  .use(signup)
  // Inline routes example
  .model(userSignInDto)
  .post(
    "/signin",
    async ({ body: { email, password }, cookie }) => {
      const user = await userSignIn(email, password, cookie)
      return user
    },
    {
      body: "userSignInDto",
    }
  )
  .use(signout)
