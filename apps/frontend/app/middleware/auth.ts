export default defineNuxtRouteMiddleware(async () => {
  const { client } = useTreaty()

  const { error } = await client.users.me.get()
  return error === null
})
