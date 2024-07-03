import { rateGuard } from "@/middleware/rateLimitter"
import Elysia, { t } from "elysia"
import { passwordReset, verifyPasswordResetToken } from "./repo/forgotPassword"

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
      body: t.Object({
        email: t.String({ format: "email" }),
      }),
    }
  )
  .post(
    "/:token",
    async ({ params: { token } }) => {
      return await verifyPasswordResetToken(token)
    },
    {
      params: t.Object({
        token: t.String(),
      }),
    }
  )
