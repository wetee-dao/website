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
      path: '/products/cloud',
      name: 'Decentralized TEE cloud',
      component: () => import('../pages/Products/Cloud.vue')
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
      path: '/launch/stake',
      name: 'Token fair launch',
      meta: {
        group: "lanch",
      },
      component: () => import('../pages/Launch/Launch.vue')
    },
    {
      path: '/launch/cross',
      name: 'Cross asset',
      meta: {
        group: "lanch",
      },
      component: () => import('../pages/Launch/Cross.vue')
    },
    {
      path: '/launch/economy',
      name: 'Token economy',
      meta: {
        group: "lanch",
      },
      component: () => import('../pages/Launch/Economy.vue')
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
      path: '/not404',
      name: 'Not404',
      component: () => import('../pages/not404.vue')
    },
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
