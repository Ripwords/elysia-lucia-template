import { Static, t } from "elysia"

export const EmailVerificationDtoObj = t.Object(
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

export type EmailVerificationDto = Static<typeof EmailVerificationDtoObj>
