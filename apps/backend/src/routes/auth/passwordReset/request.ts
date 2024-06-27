import Elysia, { t } from "elysia"
import { ErrorHandler } from "@/lib/errors/errorHandler"
import { prismaClient } from "@/lib/prisma"

export const passwordResetRequest = new Elysia().post(
  "/",
  async ({ body: { email } }) => {
    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw ErrorHandler.BadRequest("User with this email does not exist")
    }

    // Send password reset email
    return {
      status: 200,
      body: {
        message: "Password reset email sent",
      },
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
    }),
  }
)
