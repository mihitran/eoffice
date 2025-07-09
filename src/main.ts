import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import Ant Design
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// Vue Query cấu hình
import {
  VueQueryPlugin,
  QueryClient,
} from '@tanstack/vue-query'

const app = createApp(App)

// Khởi tạo Vue Query Client
const queryClient = new QueryClient()

app.use(createPinia())
app.use(router)
app.use(Antd)

// Gắn VueQueryPlugin vào app
app.use(VueQueryPlugin, {
  queryClient,
})

app.mount('#app')
