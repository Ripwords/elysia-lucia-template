import { lucia } from "@/lib/auth"
import { ErrorHandler } from "@/lib/errors"
import { CookieType } from "@/lib/utils/types"

export const userSignOut = async (cookie: CookieType) => {
  const sessionCookie = cookie[lucia.sessionCookieName]
  if (!sessionCookie.value) {
    throw ErrorHandler.BadRequest("Session not found")
  }
  await lucia.invalidateSession(sessionCookie.value)
  const blankCookie = lucia.createBlankSessionCookie()

  sessionCookie.set({
    value: blankCookie.value,
    ...blankCookie.attributes,
  })
}
