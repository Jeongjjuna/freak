// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/content'],

  ssr: true,

  app: {
    baseURL: '/freak/',
    buildAssetsDir: '/_nuxt/',
    head: {
      htmlAttrs: { lang: 'ko' },
      title: 'Freak Blog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '개발하며 배운 것들을 기록하는 블로그' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Hahmlet:wght@100..900&display=swap' },
      ],
      script: [
        {
          innerHTML: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark')}if(localStorage.getItem('color-theme')==='sakura'){document.documentElement.classList.add('sakura')}if(localStorage.getItem('weather-theme')==='rain'){document.documentElement.classList.add('rain')}}catch(e){}})()`,
          tagPosition: 'head',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          theme: {
            light: 'github-light',
            default: 'github-light',
            dark: 'dracula',
          },
          langs: [
            'js', 'ts', 'jsx', 'tsx', 'vue', 'json', 'yaml', 'html', 'css',
            'scss', 'bash', 'shell', 'sql', 'java', 'kotlin', 'python', 'go',
            'rust', 'php', 'ruby', 'xml', 'dockerfile', 'groovy', 'properties',
            'markdown', 'diff',
          ],
        },
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
})
