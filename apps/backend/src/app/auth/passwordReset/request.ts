import Elysia, { t } from "elysia"
import { prismaClient } from "../../../lib/prisma"
import { Errors } from "elysia-fault"

export const passwordResetRequest = new Elysia().post(
  "/",
  async ({ body: { email }, set }) => {
    // Check if user exists
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Errors.BadRequest("User with this email does not exist")
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
