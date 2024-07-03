import { authGuard } from "@/middleware/authGuard"
import Elysia from "elysia"
import { sendEmailVerification } from "./repo/sendEmailVerification"

export const sendVerification = new Elysia()
  .use(authGuard)
  .post("/send-email-verification", async ({ user }) => {
    await sendEmailVerification(user)
  })
