import { UnifyErrorPlugin } from "@/lib/errors"
import { treaty } from "@elysiajs/eden"
import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"

const app = new Elysia()
  .use(UnifyErrorPlugin)
  .get("/", () => "Hello from Elysia")
const api = treaty(app)

describe("Elysia", () => {
  it("Elysia Test", async () => {
    await api.index.get()
    expect()
  })
})
