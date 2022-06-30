import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import NotFound from './views/NotFound.vue'
const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  { path: '/:catchAll(.*)', component: NotFound, meta: { layout: 'empty' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
