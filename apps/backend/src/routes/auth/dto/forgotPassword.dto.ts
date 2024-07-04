import { Static, t } from "elysia"

export const ForgotPasswordVerifyDtoObj = t.Object({
  password: t.String({ minLength: 8 }),
  confirmPassword: t.String({ minLength: 8 }),
})

export type ForgotPasswordVerifyDto = Static<typeof ForgotPasswordVerifyDtoObj>

export const ForgotPasswordDtoObj = t.Object({
  email: t.String({ format: "email" }),
})

export type ForgotPasswordDto = Static<typeof ForgotPasswordDtoObj>
