import Elysia, { Cookie } from "elysia"
import { userSignIn } from "./repo/userSignIn"
import { SignInDto } from "./dto/signin.dto"
import { CookieType } from "@/lib/utils/types"
import { userSignOut } from "./repo/userSignOut"
import { SignUpDto } from "./dto/signup.dto"
import { userSignUp } from "./repo/userSignUp"
import {
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
} from "./dto/forgotPassword.dto"
import { passwordReset, verifyPasswordResetToken } from "./repo/forgotPassword"
import { ErrorHandler } from "@/lib/errors"
import { resetPassword } from "./repo/resetPassword"
import { User } from "lucia"
import { verifyEmailVerificationCode } from "./repo/emailVerification"

abstract class authService {
  static async signIn(dto: SignInDto, cookie: CookieType) {
    return await userSignIn(dto.email, dto.password, cookie)
  }

  static async signOut(cookie: CookieType) {
    await userSignOut(cookie)
  }

  static async signUp(dto: SignUpDto, cookie: CookieType) {
    return await userSignUp(
      dto.email,
      dto.password,
      dto.confirmPassword,
      dto.username,
      cookie
    )
  }

  static async forgotPassword(dto: ForgotPasswordDto) {
    return await passwordReset(dto.email)
  }

  static async verifyResetPassword(
    token: string,
    dto: ForgotPasswordVerifyDto
  ) {
    const { userId } = await verifyPasswordResetToken(token)
    if (userId) {
      if (dto.password !== dto.confirmPassword) {
        throw ErrorHandler.BadRequest("Passwords do not match")
      }

      return await resetPassword(userId, dto.password)
    }
  }

  static async sendEmailVerification(user: User) {
    await this.sendEmailVerification(user)
  }

  static async verifyEmailVerification(
    code: string,
    user: User,
    sessionCookie: Cookie<any>
  ) {
    return await verifyEmailVerificationCode(code, user, sessionCookie)
  }
}

export const AuthService = new Elysia({
  name: "AuthService",
}).decorate({
  AuthService: authService,
})
