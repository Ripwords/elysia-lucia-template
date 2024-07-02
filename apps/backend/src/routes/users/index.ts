import Elysia from "elysia"
import { authGuard } from "@/middleware/authGuard"
import { GetUsersResponseDto } from "./dto/get-users.dto"

export const UsersController = new Elysia({
  prefix: "/users",
  detail: {
    tags: ["Users"],
  },
})
  .use(authGuard)
  .get(
    "/me",
    ({ user }) => {
      return {
        id: user.id.toString(),
        email: user.email,
        username: user.name,
      }
    },
    {
      response: GetUsersResponseDto,
    }
  )
