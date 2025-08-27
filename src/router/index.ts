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
      name: 'Decentralized cloud of confidential containers',
      component: () => import('../pages/Products/Cloud.vue')
    },
    {
      path: '/products/store',
      name: 'Decentralized encrypted storage',
      component: () => import('../pages/Products/Store.vue')
    },
    {
      path: '/products/miner',
      name: 'Decentralized computing power miner',
      component: () => import('../pages/Products/Miner.vue')
    },
    {
      path: '/products/bridge',
      name: 'Trustless TEE Bridge',
      component: () => import('../pages/Products/Bridge.vue')
    },
    {
      path: '/products/mpc',
      name: 'Decentralized TEE MPC',
      component: () => import('../pages/Products/MPC.vue')
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
  document.getElementById('loader')!.style.display = "flex";
  next()
})


router.afterEach((to, from, failure) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  setTimeout(() => {
    document.getElementById('loader')!.style.display = "none";
  }, 200);
})

export default router
