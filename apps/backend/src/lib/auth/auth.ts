import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { User } from "@prisma/client"
import { ObjectId } from "bson"
import { Lucia } from "lucia"
import { prismaClient } from "../prisma"

interface DatabaseUserAttributes {
  name: User["name"]
  email: User["email"]
  hashedPassword: User["hashedPassword"]
}

interface DatabaseSessionAttributes {
  userId: User["id"]
}

const adapter = new PrismaAdapter(prismaClient.session, prismaClient.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "lucia_auth_token",
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      email: attributes.email,
      hashedPassword: attributes.hashedPassword,
    }
  },
  getSessionAttributes: (attributes) => {
    return {
      userId: attributes.userId,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    UserId: ObjectId
    DatabaseUserAttributes: DatabaseUserAttributes
    DatabaseSessionAttributes: DatabaseSessionAttributes
  }
}
