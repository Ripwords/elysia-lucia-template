import Elysia, { t } from "elysia"
import { ErrorHandler } from "@/lib/errors"
import { userSignUp } from "./repo/userSignUp"
import { userSignUpDto } from "./dto/userSignUp.dto"

export const signup = new Elysia({
  detail: {
    description: "Sign up a new user",
  },
})
  .model(userSignUpDto)
  .post(
    "/signup",
    async ({
      body: { email, password, confirmPassword, username },
      cookie,
    }) => {
      await userSignUp(email, password, confirmPassword, username, cookie)
    },
    {
      body: "userSignUpDto",
    }
  )
