import Elysia from "elysia"
import { EmailVerificationDto } from "./dto/emailVerification.dto"
import { authGuard } from "@/middleware/authGuard"
import { verifyEmailVerificationCode } from "./repo/emailVerification"

export const verifyEmail = new Elysia().use(authGuard).post(
  "/email-verification",
  async ({ body: { code }, user, sessionCookie }) => {
    return await verifyEmailVerificationCode(code, user, sessionCookie)
  },
  {
    body: EmailVerificationDto,
  }
)
