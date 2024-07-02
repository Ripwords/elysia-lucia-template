import Elysia from "elysia"
import { userSignIn } from "./repo/userSignIn"
import { SignInDto, SignInResponseDto } from "./dto/signin.dto"

export const signin = new Elysia().post(
  "/signin",
  async ({ body: { email, password }, cookie }) => {
    return await userSignIn(email, password, cookie)
  },
  {
    body: SignInDto,
    response: SignInResponseDto,
  }
)
