import { ErrorHandler } from "@/lib/errors"
import { User } from "lucia"
import {
  generateEmailVerificationCode,
  sendVerificationEmail,
} from "./emailVerification"

export const sendEmailVerification = async (user: User) => {
  // Check if user email is already verified
  if (user.emailVerified) {
    throw ErrorHandler.BadRequest("Email is already verified")
  }

  const verificationCode = await generateEmailVerificationCode(
    user.id.toString(),
    user.email
  )
  await sendVerificationEmail(user.email, verificationCode)

  return { message: "Email verification sent" }
}
