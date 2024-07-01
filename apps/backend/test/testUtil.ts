import { expect } from "bun:test"

export const errMsg = (error: String) =>
  expect.objectContaining({
    error,
    context: expect.objectContaining({
      message: expect.any(String),
    }),
  })
