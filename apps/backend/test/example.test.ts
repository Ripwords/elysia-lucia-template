import { UnifyErrorPlugin } from "@/lib/errors"
import { treaty } from "@elysiajs/eden"
import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"

const app = new Elysia().use(UnifyErrorPlugin)
const api = treaty(app)

describe("Elysia", () => {
  it("Elysia Test", async () => {
    expect()
  })
})
