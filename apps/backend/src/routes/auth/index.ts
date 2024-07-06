import { authGuard } from "@/middleware/authGuard"
import { rateGuard } from "@/middleware/rateGuard"
import Elysia from "elysia"
import { AuthService } from "./auth.service"
import {
  ForgotPasswordDto,
  ForgotPasswordVerifyDto,
} from "./dto/forgotPassword.dto"
import { SignInDto, SignInResponseDto } from "./dto/signin.dto"
import { SignUpDto, SignUpResponseDto } from "./dto/signup.dto"
import { EmailVerificationDto } from "./dto/emailVerification.dto"

export const AuthController = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Authentication"],
  },
})
  .use(AuthService)
  .use(rateGuard)
  .post(
    "/signin",
    async ({ body, cookie, AuthService }) => {
      return await AuthService.signIn(body, cookie)
    },
    {
      body: SignInDto,
      response: SignInResponseDto,
    }
  )
  .post(
    "/signup",
    async ({ body, cookie, AuthService }) => {
      return await AuthService.signUp(body, cookie)
    },
    {
      body: SignUpDto,
      response: SignUpResponseDto,
    }
  )
  .post("/signout", async ({ cookie, AuthService }) => {
    await AuthService.signOut(cookie)
  })
  .group("/forgot-password", (app) =>
    app
      .use(rateGuard)
      .post(
        "/",
        async ({ body, AuthService }) => {
          return await AuthService.forgotPassword(body)
        },
        {
          body: ForgotPasswordDto,
        }
      )
      .post(
        "/:token",
        async ({ params: { token }, body, AuthService }) => {
          return await AuthService.verifyResetPassword(token, body)
        },
        {
          body: ForgotPasswordVerifyDto,
        }
      )
  )
  .group("/email-verification", (app) =>
    app
      .use(authGuard)
      .use(rateGuard)
      .post("/", async ({ user, AuthService }) => {
        await AuthService.sendEmailVerification(user)
      })
      .post(
        "/:code",
        async ({ params: { code }, user, sessionCookie, AuthService }) => {
          return await AuthService.verifyEmailVerification(
            code,
            user,
            sessionCookie
          )
        },
        {
          params: EmailVerificationDto,
        }
      )
  )
