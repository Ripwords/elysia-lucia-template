import Elysia from "elysia"
import { userSignIn } from "./repo/userSignIn"
import { userSignInDto } from "./dto/userSignIn.dto"

export const signin = new Elysia().model(userSignInDto).post(
  "/signin",
  async ({ body: { email, password }, cookie }) => {
    const user = await userSignIn(email, password, cookie)
    return user
  },
  {
    body: "userSignInDto",
  }
)
