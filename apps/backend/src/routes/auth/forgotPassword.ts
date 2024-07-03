import { rateGuard } from "@/middleware/rateGuard"
import Elysia from "elysia"
import { passwordReset, verifyPasswordResetToken } from "./repo/forgotPassword"
import {
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
} from "./dto/forgotPassword.dto"

export const forgotPassword = new Elysia({
  prefix: "/forgot-password",
})
  .use(rateGuard)
  .post(
    "/",
    async ({ body: { email } }) => {
      return await passwordReset(email)
    },
    {
      body: ForgotPasswordDto,
    }
  )
  .post(
    "/:token",
    async ({ params: { token } }) => {
      return await verifyPasswordResetToken(token)
    },
    {
      params: ForgotPasswordVerifyDto.params,
      body: ForgotPasswordVerifyDto.body,
    }
  )
