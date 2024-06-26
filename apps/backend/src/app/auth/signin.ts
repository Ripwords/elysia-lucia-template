import Elysia, { t } from "elysia"
import { prismaClient } from "../../lib/prisma"
import { password as bunPassword } from "bun"
import { lucia } from "../../lib/auth"
import { ObjectId } from "bson"

export const signin = new Elysia()
  .model({
    userSignin: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8, maxLength: 64 }),
    }),
  })
  .post(
    "/signin",
    async ({ body: { email, password }, cookie, set }) => {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return {
          status: 400,
          body: {
            message: "User with this email does not exist",
          },
        }
      }

      const passwordHash = await bunPassword.verify(
        password + user.passwordSalt + process.env.PASSWORD_PEPPER,
        user.hashedPassword!
      )

      if (!passwordHash) {
        return {
          status: 400,
          body: {
            message: "Incorrect password",
          },
        }
      }

      const session = await lucia.createSession(new ObjectId(user.id), {
        userId: user.id,
      })
      const sessionCookie = lucia.createSessionCookie(session.id)

      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      })

      return {
        id: user.id,
        email: user.email,
        username: user.name,
      }
    },
    {
      body: "userSignin",
    }
  )
