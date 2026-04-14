import './assets/ui.css'
import './assets/main.scss'

import { createApp } from 'vue'
import nuxt from '@nuxt/ui/vue-plugin'
import 'virtual:svg-icons-register'

import App from './App.vue'
import router from './router'
import { i18n } from './locales'
import pop from './plugins/pop'
import chain, { chainNetPing, initChainApi } from './plugins/chain'
import { store, useGlobalStore } from './stores/global'

const m = () => {
  const app = createApp(App)

  app.use(store)
  app.use(router)
  app.use(i18n)
  app.use(pop)
  app.use(chain)
  app.use(nuxt)
  app.mount('#app')
}

const ins = useGlobalStore(store)
if (ins.chainId) {
  initChainApi(ins.chainId)
  m()

  chainNetPing()
} else {
  chainNetPing().then((id) => {
    ins.setChain(id)
    initChainApi(id)

    m()
  })
}


declare global {
    interface Window {
        $toast: ReturnType<typeof import('@nuxt/ui/composables').useToast>;
        $app: any;
    }
}
