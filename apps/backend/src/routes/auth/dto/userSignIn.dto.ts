import { t } from "elysia"

export const userSignInDto = {
  userSignInDto: t.Object({
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8, maxLength: 64 }),
  }),
}
