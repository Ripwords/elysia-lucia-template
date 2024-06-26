import { lucia } from "../../lib/auth"
import { Elysia, t } from "elysia"
import { Errors } from "elysia-fault"
import { verifyRequestOrigin } from "lucia"

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
      set,
    }) => {
      const sessionCookie = cookie[sessionCookieName]
      const sessionId: string | null | undefined =
        lucia.readBearerToken(authorization ?? "") ?? sessionCookie?.value
      console.log(sessionId)

      if (
        !authorization &&
        method !== "GET" &&
        (!origin ||
          !host ||
          !verifyRequestOrigin(origin, [process.env.WEBSITE_URL!]))
      ) {
        throw new Errors.Forbidden("Invalid Origin")
      }

      if (!sessionId) {
        throw new Errors.Unauthorized("You are not authenticated")
      }

      const { session, user } = await lucia.validateSession(sessionId)
      console.log(session, user)
      if (!session && !user) {
        throw new Errors.Unauthorized("Session is invalid")
      }

      if (!session) {
        const newSessionCookie = lucia.createBlankSessionCookie()
        sessionCookie?.set({
          value: newSessionCookie.value,
          ...newSessionCookie.attributes,
        })
        throw new Errors.Unauthorized("Session is invalid")
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
