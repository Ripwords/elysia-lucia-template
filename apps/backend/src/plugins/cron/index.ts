import cron from "@elysiajs/cron"
import Elysia from "elysia"
import { lucia } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/* This code snippet is creating a `cleaner` constant that is an instance of the `Elysia` class with a
cron job attached to it. The cron job is scheduled to run at midnight every day (pattern: "0 0 * * *") and its task is to asynchronously delete expired sessions using the
`lucia.deleteExpiredSessions()` method. */
export const SessionCleaner = new Elysia().use(
  cron({
    name: "cleanExpiredSessions",
    pattern: "0 0 * * *",
    async run() {
      await lucia.deleteExpiredSessions()
    },
  })
)

export const TokenCleaner = new Elysia().use(
  cron({
    name: "cleanExpiredTokens",
    pattern: "*/15 * * * *",
    async run() {
      await prisma.$transaction([
        prisma.emailVerificationToken.deleteMany({
          where: {
            expiresAt: {
              lte: new Date(),
            },
          },
        }),
        prisma.passwordResetToken.deleteMany({
          where: {
            expiresAt: {
              lte: new Date(),
            },
          },
        }),
      ])
    },
  })
)
