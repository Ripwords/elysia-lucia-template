// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    typedPages: true,
  },

  ssr: false,

  primevue: {
    importTheme: {
      from: "@/utils/theme",
    },
  },

  imports: {
    dirs: ["utils/**"],
  },

  modules: [
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
  ],

  compatibilityDate: "2024-07-03",
})
