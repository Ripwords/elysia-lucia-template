import { t } from "elysia"

export const EmailVerificationDto = t.Object(
  {
    code: t.RegExp(/^[A-Za-z0-9]{8}$/, {
      error: "Invalid email verification code",
    }),
  },
  {
    description: "Email verification code",
    examples: [{ code: "********" }],
  }
)
