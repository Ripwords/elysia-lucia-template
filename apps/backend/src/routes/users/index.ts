import Elysia from "elysia"
import { authGuard } from "@/middleware/authGuard"

export const UsersController = new Elysia({
  prefix: "/users",
  detail: {
    tags: ["Users"],
  },
})
  .use(authGuard)
  .get("/me", ({ user }) => {
    return {
      id: user.id,
      email: user.email,
      username: user.name,
    }
  })
