import { t } from "elysia"

export const ForgotPasswordVerifyDto = {
  params: t.Object({
    token: t.String(),
  }),
  body: t.Object({
    password: t.String({ minLength: 8 }),
    confirmPassword: t.String({ minLength: 8 }),
  }),
}

export const ForgotPasswordDto = t.Object({
  email: t.String({ format: "email" }),
})
