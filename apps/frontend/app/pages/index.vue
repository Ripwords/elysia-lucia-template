<script lang="ts" setup>
import { treaty } from "@elysiajs/eden"
import type { App } from "../../../backend/src/app/main"

const client = treaty<App>(import.meta.env.VITE_SERVER_URL, {
  fetch: {
    credentials: "include",
  },
})

const user = ref()
const email = ref("")
const password = ref("")

const signIn = async () => {
  await client.auth.signin.post({
    email: email.value,
    password: password.value,
  })

  await getUser()
}

const signOut = async () => {
  await client.auth.signout.post()
  user.value = null
}

const getUser = async () => {
  const { data, error } = await client.users.me.get()
  if (error) {
    switch (error.status) {
      case 401:
        console.log("UNAUTHORIZED")
        break
      default:
        console.log("ERROR")
        break
    }
  }
  user.value = data
}
</script>

<template>
  <input
    v-model="email"
    type="text"
    placeholder="Email"
  />
  <input
    v-model="password"
    type="password"
    placeholder="Password"
  />
  <br />
  <button @click="signIn">Sign In</button>
  <button @click="signOut">Sign Out</button>
  <button @click="getUser">Get User</button>

  <div v-if="user">{{ user }}</div>
</template>
