<script lang="ts" setup>
const { client } = useTreaty()

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
  const { data } = await client.users.me.get()
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
