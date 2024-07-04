import { ErrorHandler } from "@/lib/errors"
import { password as bunPassword } from "bun"
import { alphabet, generateRandomString } from "oslo/crypto"
import { prisma } from "@/lib/prisma"
import { lucia } from "@/lib/auth"
import { ObjectId } from "bson"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { SignUpResponse } from "../dto/signup.dto"
import {
  generateEmailVerificationCode,
  sendVerificationEmail,
} from "./emailVerification"
import { CookieType } from "@/lib/utils/types"

export const userSignUp = async (
  email: string,
  password: string,
  confirmPassword: string,
  username: string,
  cookie: CookieType
): Promise<SignUpResponse> => {
  if (password !== confirmPassword) {
    throw ErrorHandler.BadRequest("Passwords do not match")
  }

  try {
    const emailExists = await prisma.user.findUnique({
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

  const passwordSalt = generateRandomString(16, alphabet("a-z", "A-Z", "0-9"))
  const passwordHash = await bunPassword.hash(
    password + passwordSalt + process.env.PASSWORD_PEPPER
  )

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name: username,
        hashedPassword: passwordHash,
        passwordSalt,
        emailVerified: false,
      },
    })

    const verificationCode = await generateEmailVerificationCode(
      newUser.id,
      email
    )
    await sendVerificationEmail(email, verificationCode)

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
    }
  } catch {
    throw ErrorHandler.InternalServerError()
  }
}
