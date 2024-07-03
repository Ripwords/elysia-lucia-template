import { ErrorHandler } from "@/lib/errors"
import Elysia from "elysia"
import { rateLimit } from "elysia-rate-limit"

export const rateGuard = new Elysia({
  name: "rateGuard",
}).use(
  rateLimit({
    scoping: "scoped",
    errorResponse: ErrorHandler.TooManyRequests(
      "You have reached the maximum number of requests. Please try again later."
    ),
  })
)
