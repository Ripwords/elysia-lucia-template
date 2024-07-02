import { t, Static } from "elysia"

export const GetUsersResponseDto = t.Object(
  {
    id: t.String(),
    email: t.String({ format: "email" }),
    username: t.String(),
  },
  {
    description: "Get Users response.",
  }
)

export type GetUsersResponse = Static<typeof GetUsersResponseDto>
