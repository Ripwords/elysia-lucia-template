import { lucia } from "../lib/auth"
import { Elysia, t } from "elysia"
import { verifyRequestOrigin } from "lucia"
import { ErrorHandler } from "@/lib/errors"

const sessionCookieName = lucia.sessionCookieName

// Auth guard middleware
export const authGuard = new Elysia({
  name: "authGuard",
})
  .guard({
    cookie: t.Object({
      [sessionCookieName]: t.Optional(t.String()),
    }),
    headers: t.Object({
      origin: t.Optional(t.String()),
      host: t.Optional(t.String()),
      authorization: t.Optional(t.String()),
    }),
  })
  .resolve(
    { as: "scoped" },
    async ({
      cookie,
      headers: { authorization, origin, host },
      request: { method },
    }) => {
      // CSRF protection
      if (
        !authorization &&
        method !== "GET" &&
        (!origin ||
          !host ||
          !verifyRequestOrigin(origin, [process.env.WEBSITE_URL!]))
      ) {
        throw ErrorHandler.Forbidden("Invalid Origin")
      }

      // Get session id from cookie or authorization header
      const sessionCookie = cookie[sessionCookieName]
      const sessionId: string | null | undefined =
        lucia.readBearerToken(authorization ?? "") ?? sessionCookie?.value

      // If session id is not found, user is not authenticated
      if (!sessionId) {
        throw ErrorHandler.Unauthorized("You are not authenticated")
      }

      // Validate session
      const { session, user } = await lucia.validateSession(sessionId)

      // Throw error if session is invalid
      if (!session && !user) {
        throw ErrorHandler.Unauthorized("Session is invalid")
      }

      // If session has expired, return unauthorized
      if (!session) {
        const newSessionCookie = lucia.createBlankSessionCookie()
        sessionCookie?.set({
          value: newSessionCookie.value,
          ...newSessionCookie.attributes,
        })
        throw ErrorHandler.Unauthorized("Session is invalid")
      }

      // If session is fresh, update session cookie
      if (session?.fresh) {
        const newSessionCookie = lucia.createSessionCookie(sessionId)
        sessionCookie?.set({
          value: newSessionCookie.value,
          ...newSessionCookie.attributes,
        })
      }

      return { user }
    }
  )
