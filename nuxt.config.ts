// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],
  
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },
  
  css: ['mind-elixir/style.css'],
  
  vite: {
    optimizeDeps: {
      include: ['mind-elixir']
    }
  }
})
