import { ObjectId } from "bson"
import { password as bunPassword } from "bun"
import { lucia } from "@/lib/auth"
import { ErrorHandler } from "@/lib/errors"
import { prisma } from "@/lib/prisma"
import { SignInResponseDto } from "../dto/signin.dto"
import { CookieType } from "@/lib/utils/types"

export const userSignIn = async (
  email: string,
  password: string,
  cookie: CookieType
): Promise<SignInResponseDto> => {
  let user: Awaited<ReturnType<typeof prisma.user.findUnique>>

  try {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw Error
    }
  } catch {
    throw ErrorHandler.Unauthorized("User with this email does not exist")
  }

  const passwordHash = await bunPassword.verify(
    password + user.passwordSalt + process.env.PASSWORD_PEPPER,
    user.hashedPassword!
  )

  if (!passwordHash) {
    throw ErrorHandler.Unauthorized("Invalid password")
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
}
