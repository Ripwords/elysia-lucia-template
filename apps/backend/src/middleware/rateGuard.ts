import { ErrorHandler } from "@/lib/errors"
import { rateLimit } from "elysia-rate-limit"

export const rateGuard = rateLimit({
  scoping: "scoped",
  errorResponse: ErrorHandler.TooManyRequests(
    "You have reached the maximum number of requests. Please try again later."
  ),
})
