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
  <div>
    <InputText
      v-model="email"
      type="email"
      placeholder="Email"
    />
    <Password
      v-model="password"
      placeholder="Password"
    />
    <Button @click="signIn">Sign In</Button>
    <Button @click="signOut">Sign Out</Button>
    <Button @click="getUser">Get User</Button>

    <div v-if="user">{{ user }}</div>
  </div>
</template>
