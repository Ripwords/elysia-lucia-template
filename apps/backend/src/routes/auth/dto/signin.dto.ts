import { t, Static } from "elysia"

export const SignInDto = t.Object(
  {
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8, maxLength: 64 }),
  },
  {
    description: "Sign In with email and password.",
    examples: [
      {
        email: "test@mail.com",
        password: "password",
      },
    ],
  }
)

export type SignInDto = Static<typeof SignInDto>

export const SignInResponseDto = t.Object(
  {
    id: t.String(),
    email: t.String({ format: "email" }),
    username: t.String(),
  },
  {
    description: "Sign In response.",
  }
)

export type SignInResponseDto = Static<typeof SignInResponseDto>
