import Elysia, { t } from "elysia"
import { password as bunPassword } from "bun"
import { alphabet, generateRandomString } from "oslo/crypto"
import { prismaClient } from "../../lib/prisma"
import { lucia } from "../../lib/auth"
import { ObjectId } from "bson"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { ErrorHandler } from "../../lib/errors/errorHandler"

export const signup = new Elysia({
  detail: {
    description: "Sign up a new user",
  },
})
  .model({
    userSignup: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8, maxLength: 64 }),
      confirmPassword: t.String({ minLength: 8 }),
      username: t.String({ minLength: 3, maxLength: 32 }),
    }),
  })
  .post(
    "/signup",
    async ({
      body: { email, password, confirmPassword, username },
      cookie,
    }) => {
      try {
        const emailExists = await prismaClient.user.findUnique({
          where: {
            email,
          },
        })

        if (emailExists) {
          throw Error()
        }
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          throw ErrorHandler.InternalServerError("Database error")
        } else {
          throw ErrorHandler.BadRequest("User with this email already exists")
        }
      }

      if (password !== confirmPassword) {
        return {
          status: 400,
          body: {
            message: "Passwords do not match",
          },
        }
      }

      const passwordSalt = generateRandomString(
        16,
        alphabet("a-z", "A-Z", "0-9")
      )
      const passwordHash = await bunPassword.hash(
        password + passwordSalt + process.env.PASSWORD_PEPPER
      )

      try {
        const newUser = await prismaClient.user.create({
          data: {
            email,
            name: username,
            hashedPassword: passwordHash,
            passwordSalt,
          },
        })

        const session = await lucia.createSession(new ObjectId(newUser.id), {
          userId: newUser.id,
        })
        const sessionCookie = lucia.createSessionCookie(session.id)

        cookie[sessionCookie.name]?.set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        })

        return {
          id: newUser.id,
          email: newUser.email,
          username: newUser.name,
        }
      } catch {
        throw ErrorHandler.InternalServerError()
      }
    },
    {
      body: "userSignup",
    }
  )
