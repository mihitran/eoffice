import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CreateView from '@/views/Indocument/Create/CreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {path: 'indocument/create', name: 'home', component: CreateView},
        // {path: 'dashboard', name: 'dashboard', component: Dashboard },
      ]
    }
  ],
})

export default router
