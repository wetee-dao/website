import './assets/main.scss'

import { createApp } from 'vue'
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
        $notification: any;
        $app: any;
    }
}
