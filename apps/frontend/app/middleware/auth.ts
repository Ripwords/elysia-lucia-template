export default defineNuxtRouteMiddleware(async () => {
  const { client } = useTreaty()

  const { data, error } = await client.users.me.get()
  console.log(error)
})
