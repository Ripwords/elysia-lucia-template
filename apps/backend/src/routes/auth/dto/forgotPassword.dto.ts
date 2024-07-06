import { Static, t } from "elysia"

export const ForgotPasswordVerifyDto = t.Object({
  password: t.String({ minLength: 8 }),
  confirmPassword: t.String({ minLength: 8 }),
})

export type ForgotPasswordVerifyDto = Static<typeof ForgotPasswordVerifyDto>

export const ForgotPasswordDto = t.Object({
  email: t.String({ format: "email" }),
})

export type ForgotPasswordDto = Static<typeof ForgotPasswordDto>
