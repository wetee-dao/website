import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import { useGlobalStore } from '@/stores/global'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tee-store',
      name: 'TEE application store',
      component: () => import('../pages/TeeStore.vue')
    },
    {
      path: '/vm',
      name: 'TEE container vm',
      component: () => import('../pages/Vm.vue')
    },
    {
      path: '/use-cases',
      name: 'TEE container use cases',
      component: () => import('../pages/UserCases.vue')
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: () => import('../pages/Contact.vue')
    },
    {
      path: '/stake',
      name: 'Token fair launch',
      meta: {
        group: "lanch",
      },
      component: () => import('../pages/Token.vue')
    },
    {
      path: '/cross',
      name: 'Cross asset',
      meta: {
        group: "lanch",
      },
      component: () => import('../pages/Cross.vue')
    },
    {
      path: '/chain-mint',
      name: 'Chain mint',
      component: () => import('../pages/Chainmint.vue')
    },
    {
      path: '/dev-start',
      name: 'Dev start',
      component: () => import('../pages/DevStart.vue')
    },
    {
      path: '/economy',
      name: 'Token economy',
      meta: {
        group: "lanch",
      },
      component: () => import('../pages/Economy.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useGlobalStore()
  userStore.setPaths([
    { path: to.path, name: to.name, meta: to.meta }
  ])
  next()
})


export default router
