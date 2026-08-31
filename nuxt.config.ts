import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/style.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: 'ប្រព័ន្ធគ្រប់គ្រងពិន្ទុថ្នាក់រៀន - Single Class Management System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Modern Single Class Management System with real-time grade calculations, teacher gradebook, student portal, and admin lock controls.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }
      ]
    }
  }
})
