import Elysia from "elysia"
import { userSignOut } from "./repo/userSignOut"

export const signout = new Elysia().post("/signout", async ({ cookie }) => {
  await userSignOut(cookie)
})
