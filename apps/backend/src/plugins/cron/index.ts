import Elysia from "elysia"
import { TokenCleaner } from "./tokenCleaner"
import { SessionCleaner } from "./sessionCleaner"

export const CronController = new Elysia().use(SessionCleaner).use(TokenCleaner)
