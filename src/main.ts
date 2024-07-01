import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { worker } from './mocks/browser'

import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

worker.start({
  onUnhandledRequest: 'bypass'
})

const app = createApp(App)

app.use(createPinia())

app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
