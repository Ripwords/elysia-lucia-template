import { alphabet, generateRandomString } from "oslo/crypto"
import { password as bunPassword } from "bun"
import { prisma } from "@/lib/prisma"
import { ErrorHandler } from "@/lib/errors"

export const resetPassword = async (userId: string, password: string) => {
  const passwordSalt = generateRandomString(16, alphabet("a-z", "A-Z", "0-9"))
  const passwordHash = await bunPassword.hash(
    password + passwordSalt + process.env.PASSWORD_PEPPER
  )

  // Check if the password is the same as the previous password
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (user?.hashedPassword === passwordHash) {
    throw ErrorHandler.BadRequest(
      "Password cannot be the same as the previous password"
    )
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedPassword: passwordHash,
        passwordSalt,
        // In the case where email was not verified before,
        // after a successful password reset, we can assume that the email is verified
        emailVerified: true,
      },
    })
  } catch {
    throw ErrorHandler.InternalServerError("Database error")
  }

  return {
    message: "Password reset successful",
  }
}
