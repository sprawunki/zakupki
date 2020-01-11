export default {
  /*
   ** Headers of the page
   */
  head: {
    title: 'Zakupki',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Zakupki GUI' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          '//fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,700,400italic|Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#448aff' },
  /*
   ** Build configuration
   */
  css: [{ src: '~/assets/theme.scss', lang: 'scss' }],
  plugins: [{ src: '~/plugins/localStorage.js', ssr: false }],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    [
      'nuxt-env',
      {
        keys: [{ key: 'API_URL', default: 'http://localhost:9080' }]
      }
    ]
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/graphql': process.env.API_PROXY_URL
  },
  generate: {
    dir: 'public'
  },
  router: {
    base: process.env.BASE_PATH || '/'
  },
  env: {
    apiUrl: process.env.API_URL
  }
}
