import { t } from "elysia"

export const userSignUpDto = {
  userSignUpDto: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8, maxLength: 64 }),
    confirmPassword: t.String({ minLength: 8 }),
    username: t.String({ minLength: 3, maxLength: 32 }),
  }),
}
