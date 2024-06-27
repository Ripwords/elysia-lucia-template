import { treaty } from "@elysiajs/eden"
import type { App } from "../../../backend/src/app/main"

export const useTreaty = () => {
  const client = treaty<App>(import.meta.env.VITE_SERVER_URL, {
    fetch: {
      credentials: "include",
    },
  })
  return {
    client,
  }
}
