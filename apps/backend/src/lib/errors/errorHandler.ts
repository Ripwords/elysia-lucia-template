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
