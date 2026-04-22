// https://nuxt.com/docs/api/configuration/nuxt-config
const rawBaseURL = process.env.NUXT_APP_BASE_URL ?? '/'
const normalizedBaseURL = rawBaseURL === '/'
  ? '/'
  : `/${rawBaseURL.replace(/^\/+|\/+$/g, '')}/`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/main.css',
  ],
  app: {
    baseURL: normalizedBaseURL,
    head: {
      title: 'Juan Vasquez — Portafolio 2027',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Desarrollador de software fullstack — NestJS, Nuxt, AWS.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;700;900&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap',
        },
      ],
    },
  },
})
