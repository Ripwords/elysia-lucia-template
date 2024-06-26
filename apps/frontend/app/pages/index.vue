<script lang="ts" setup>
import { treaty } from "@elysiajs/eden"
import type { App } from "../../../backend/src/app"

const client = treaty<App>(import.meta.env.VITE_SERVER_URL, {
  fetch: {
    credentials: "include",
  },
})

const signIn = async () => {
  console.log("SIGNING IN...")
  const { data, error } = await client.auth.signin.post({
    email: "teohjjteoh@gmail.com",
    password: "teohjjteoh@gmail.com",
  })

  console.log(error)
  console.log(data)
}

const signOut = async () => {
  console.log("SIGNING OUT...")
  const { data, error } = await client.auth.signout.post()
  console.log(error)
  console.log(data)
}

const getUser = async () => {
  const { data, error } = await client.users.me.get()
  console.log(error)
  console.log(data)
}
</script>

<template>
  <button @click="signIn">Sign In</button>
  <button @click="signOut">Sign Out</button>
  <button @click="getUser">Get User</button>
</template>
