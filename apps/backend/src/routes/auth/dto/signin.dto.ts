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

export type SignInResponse = Static<typeof SignInResponseDto>
