import { prisma } from "@/lib/prisma"
import { TimeSpan, createDate } from "oslo"
import { generateRandomString, alphabet } from "oslo/crypto"
import { createTransport } from "nodemailer"
import { User } from "lucia"
import { Cookie } from "elysia"
import { lucia } from "@/lib/auth"
import { ObjectId } from "bson"
import { ErrorHandler } from "@/lib/errors"

export const generateEmailVerificationCode = async (
  userId: string,
  email: string
): Promise<string> => {
  const code = generateRandomString(8, alphabet("0-9", "A-Z"))

  try {
    await prisma.$transaction([
      prisma.emailVerificationToken.delete({ where: { userId } }),
      prisma.emailVerificationToken.create({
        data: {
          userId,
          email,
          code,
          expiresAt: createDate(new TimeSpan(15, "m")), // 15 minutes
        },
      }),
    ])
  } catch {
    await prisma.emailVerificationToken.create({
      data: {
        userId,
        email,
        code,
        expiresAt: createDate(new TimeSpan(15, "m")), // 15 minutes
      },
    })
  }

  return code
}

export const sendVerificationEmail = async (email: string, code: string) => {
  const auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  }

  const transporter = createTransport({
    name: process.env.SMTP_HOST!.split(".").slice(-2).join("."),
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth,
  })

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Email Verification",
    text: `Your email verification code is: ${code}`,
  })

  console.log(info)
}

export const verifyEmailVerificationCode = async (
  code: string,
  user: User,
  sessionCookie: Cookie<string | undefined>
) => {
  // Check code validity
  const isCodeValid = await prisma.emailVerificationToken.findUnique({
    where: {
      code,
      userId: user.id.toString(),
      expiresAt: { gte: new Date() },
    },
  })

  if (!isCodeValid) {
    throw ErrorHandler.BadRequest("Invalid or expired code")
  }

  // Check if email is already verified
  if (user.emailVerified) {
    throw ErrorHandler.BadRequest("Email is already verified")
  }

  // Update user email verification status
  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { code } }),
    prisma.user.update({
      where: { id: user.id.toString() },
      data: { emailVerified: true },
    }),
  ])

  // Invalidate all user sessions
  await lucia.invalidateUserSessions(new ObjectId(user.id))

  // Create new session
  const session = await lucia.createSession(user.id, {
    userId: user.id.toString(),
  })
  const newSessionCookie = lucia.createSessionCookie(session.id)
  sessionCookie?.set({
    value: newSessionCookie.value,
    ...newSessionCookie.attributes,
  })

  return {
    message: "Email verification successful",
  }
}
