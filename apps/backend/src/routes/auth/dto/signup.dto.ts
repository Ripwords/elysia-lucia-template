import { t, Static } from "elysia"

export const SignUpDtoObj = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  confirmPassword: t.String({ minLength: 8 }),
  username: t.String({ minLength: 3, maxLength: 32 }),
})

export type SignUpDto = Static<typeof SignUpDtoObj>

export const SignUpResponseDtoObj = t.Object({
  id: t.String(),
})

export type SignUpResponse = Static<typeof SignUpResponseDtoObj>
