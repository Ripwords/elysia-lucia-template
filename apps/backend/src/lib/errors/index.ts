import Elysia from "elysia"
import {
  BadRequest,
  InternalServerError,
  CustomError,
  Forbidden,
  NotFound,
  NotImplemented,
  Unauthorized,
  TimeOut,
  TooManyRequests,
} from "unify-errors"

export class ErrorHandler {
  static BadRequest(message?: string) {
    return new BadRequest({
      message,
    })
  }

  static InternalServerError(message?: string) {
    return new InternalServerError({
      message,
    })
  }

  static CustomError(message: string) {
    return new CustomError(message)
  }

  static Forbidden(message?: string) {
    return new Forbidden({
      message,
    })
  }

  static NotFound(message?: string) {
    return new NotFound({
      message,
    })
  }

  static NotImplemented(message?: string) {
    return new NotImplemented({
      message,
    })
  }

  static Unauthorized(message?: string) {
    return new Unauthorized({
      message,
    })
  }

  static TimeOut(message?: string) {
    return new TimeOut({
      message,
    })
  }

  static TooManyRequests(message?: string) {
    return new TooManyRequests({
      message,
    })
  }
}

export const UnifyErrorPlugin = new Elysia({
  name: "unify-error-elysia",
}).onError({ as: "global" }, ({ code, error, set }) => {
  console.error(error.stack)
  let httpCode = 0
  let customErrorMessage

  const errorName =
    error.constructor.name === "Error"
      ? error.name || "Error"
      : error.constructor.name

  //Try to parse the error message as JSON
  let errorMessage: Error | undefined
  try {
    errorMessage = JSON.parse(error.message)
  } catch (_) {
    _
  }

  switch (errorName) {
    case BadRequest.name: {
      httpCode = 400
      break
    }
    case Unauthorized.name: {
      httpCode = 401
      break
    }
    case Forbidden.name: {
      httpCode = 403
      break
    }
    case NotFound.name: {
      httpCode = 404
      break
    }
    case TimeOut.name: {
      httpCode = 408
      break
    }
    case TooManyRequests.name: {
      httpCode = 429
      break
    }
    case InternalServerError.name: {
      httpCode = 500
      break
    }
    case NotImplemented.name: {
      httpCode = 501
      break
    }
    default: {
      httpCode = 500
      customErrorMessage = "An unexpected error occured"
      break
    }
  }

  const response = {
    error: customErrorMessage || errorMessage?.message || error.message,
    context: (error as CustomError).context || undefined,
  }

  if (code === "VALIDATION") {
    set.status = 400

    customErrorMessage = error.validator.Errors(error.value).First()

    return {
      error: "Bad Request",
      context: {
        message: customErrorMessage.schema.error || customErrorMessage.message,
      },
    }
  } else if (error?.message?.toLowerCase()?.includes("rate limit")) {
    set.status = 429

    return {
      error: "Too Many Requests",
    }
  } else {
    switch (code) {
      case "PARSE":
      case "INTERNAL_SERVER_ERROR":
      case "INVALID_COOKIE_SIGNATURE":
        set.status = 500

        return {
          ...response,
          code,
        }
      case "NOT_FOUND":
        set.status = 404

        return {
          error: "Not Found",
        }
      case "UNKNOWN":
        set.status = httpCode

        return response
    }
  }
})
