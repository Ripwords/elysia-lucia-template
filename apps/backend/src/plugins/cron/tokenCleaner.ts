import cron from "@elysiajs/cron"
import Elysia from "elysia"
import { prisma } from "@/lib/prisma"

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
