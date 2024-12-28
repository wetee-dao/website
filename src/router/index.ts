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
      path: '/tokens',
      name: 'Token fair launch',
      component: () => import('../pages/Token.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useGlobalStore()
  userStore.setPaths([
    { path: to.path, name: to.name }
  ])
  // //页面是否需要登录
  // if (to.meta) {
  //   //页面是否登录
  //   if (localStorage.getItem("token")) {
  //     //本地存储中是否有token(uid)数据
  //     next();
  //   } else {
  //     next({ name: "Login" });
  //   }
  //   return
  // }
  next()
})


export default router
