import { lucia } from "../../lib/auth"
import { Elysia, t } from "elysia"
import { verifyRequestOrigin } from "lucia"
import { ErrorHandler } from "../../lib/errors/errorHandler"

const sessionCookieName = lucia.sessionCookieName

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
      const sessionCookie = cookie[sessionCookieName]
      const sessionId: string | null | undefined =
        lucia.readBearerToken(authorization ?? "") ?? sessionCookie?.value

      if (
        !authorization &&
        method !== "GET" &&
        (!origin ||
          !host ||
          !verifyRequestOrigin(origin, [process.env.WEBSITE_URL!]))
      ) {
        throw ErrorHandler.Forbidden("Invalid Origin")
      }

      if (!sessionId) {
        throw ErrorHandler.Unauthorized("You are not authenticated")
      }

      const { session, user } = await lucia.validateSession(sessionId)

      if (!session && !user) {
        throw ErrorHandler.Unauthorized("Session is invalid")
      }

      if (!session) {
        const newSessionCookie = lucia.createBlankSessionCookie()
        sessionCookie?.set({
          value: newSessionCookie.value,
          ...newSessionCookie.attributes,
        })
        throw ErrorHandler.Unauthorized("Session is invalid")
      }

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
