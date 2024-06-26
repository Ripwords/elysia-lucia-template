import Elysia from "elysia"
import { lucia } from "../../lib/auth"
import { Errors } from "elysia-fault"

export const signout = new Elysia().post("/signout", async ({ cookie }) => {
  const sessionCookie = cookie[lucia.sessionCookieName]
  if (!sessionCookie.value) {
    throw new Errors.BadRequest("Session not found")
  }
  await lucia.invalidateSession(sessionCookie.value)
  const blankCookie = lucia.createBlankSessionCookie()

  sessionCookie.set({
    value: blankCookie.value,
    ...blankCookie.attributes,
  })
})
