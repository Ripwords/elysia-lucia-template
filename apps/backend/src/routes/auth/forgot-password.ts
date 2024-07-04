import { rateGuard } from "@/middleware/rateGuard"
import Elysia from "elysia"
import { passwordReset, verifyPasswordResetToken } from "./repo/forgotPassword"
import {
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
} from "./dto/forgotPassword.dto"
import { resetPassword } from "./repo/resetPassword"
import { ErrorHandler } from "@/lib/errors"

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
    async ({ params: { token }, body: { password, confirmPassword } }) => {
      const { userId } = await verifyPasswordResetToken(token)
      if (userId) {
        if (password !== confirmPassword) {
          throw ErrorHandler.BadRequest("Passwords do not match")
        }

        return await resetPassword(userId, password)
      }
    },
    {
      params: ForgotPasswordVerifyDto.params,
      body: ForgotPasswordVerifyDto.body,
    }
  )
