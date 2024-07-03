import Elysia from "elysia"
import { EmailVerificationDto } from "./dto/emailVerification.dto"
import { authGuard } from "@/middleware/authGuard"
import {
  sendEmailVerification,
  verifyEmailVerificationCode,
} from "./repo/emailVerification"
import { rateGuard } from "@/middleware/rateGuard"

export const verifyEmail = new Elysia({
  prefix: "/email-verification",
})
  .use(authGuard)
  .use(rateGuard)
  .post("/", async ({ user }) => {
    await sendEmailVerification(user)
  })
  .post(
    "/:code",
    async ({ params: { code }, user, sessionCookie }) => {
      return await verifyEmailVerificationCode(code, user, sessionCookie)
    },
    {
      params: EmailVerificationDto,
    }
  )
