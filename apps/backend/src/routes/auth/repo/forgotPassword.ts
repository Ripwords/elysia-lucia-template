import { ErrorHandler } from "@/lib/errors"
import { prisma } from "@/lib/prisma"
import { generateRandomString, alphabet } from "oslo/crypto"
import { password as bunPassword } from "bun"
import { sendEmail } from "@/lib/utils/email"

export const passwordReset = async (email: string) => {
  // Check if the email is a valid user email
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw ErrorHandler.NotFound("User not found")
  }

  // Generate a random token
  const token = generateRandomString(32, alphabet("a-z", "A-Z", "0-9"))
  const hashedToken = await bunPassword.hash(
    token + process.env.PASSWORD_PEPPER
  )

  try {
    await prisma.$transaction([
      // Delete all existing password reset tokens
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
        },
      }),
      // Create a new password reset token
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes
          hashedToken,
        },
      }),
    ])
  } catch {
    throw ErrorHandler.InternalServerError("Database error")
  }

  // Send the token to the user's email
  await sendEmail(
    user.email,
    "Password Reset",
    `Click the link to reset your password: http${process.env.NODE_ENV !== "production" ? "s" : ""}://${process.env.WEBSITE_URL}/reset-password/${token}`
  )

  return { message: "Password reset token sent" }
}

export const verifyPasswordResetToken = async (token: string) => {
  // Check if the token is valid
  const resetTokens = await prisma.passwordResetToken.findMany({
    where: {
      expiresAt: { gte: new Date() },
    },
  })

  if (resetTokens.length === 0) {
    throw ErrorHandler.BadRequest("Invalid or expired token")
  }

  const resetToken = resetTokens.find((t) => {
    return bunPassword.verify(
      token + process.env.PASSWORD_PEPPER,
      t.hashedToken
    )
  })

  if (!resetToken) {
    throw ErrorHandler.BadRequest("Invalid or expired token")
  }

  // Delete the token
  await prisma.passwordResetToken.delete({
    where: {
      id: resetToken.id,
    },
  })

  return {
    userId: resetToken.userId,
  }
}
