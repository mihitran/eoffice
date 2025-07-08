import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AboutView from '../views/AboutView.vue'
import CreateView from '@/views/Indocument/Create/CreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {path: '', name: 'home', component: CreateView},
        // {path: 'dashboard', name: 'dashboard', component: Dashboard },
      ]
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        {path: 'about', name: 'about', component: AboutView},
      ]
    },
  ],
})

export default router
