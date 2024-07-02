import Elysia from "elysia"
import { userSignUp } from "./repo/userSignUp"
import { SignUpDto, SignUpResponseDto } from "./dto/signup.dto"

export const signup = new Elysia({
  detail: {
    description: "Sign up a new user",
  },
}).post(
  "/signup",
  async ({ body: { email, password, confirmPassword, username }, cookie }) => {
    return await userSignUp(email, password, confirmPassword, username, cookie)
  },
  {
    body: SignUpDto,
    response: SignUpResponseDto,
  }
)
