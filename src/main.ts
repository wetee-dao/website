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
import { bootstrapApplyMainChainContractsFromSlice } from './apis/chain-info'
import { syncMainChainInkContracts } from './apis/main-chain'

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

function showBootstrapFatal(message: string, err: unknown) {
  console.error('[chain_info]', err)
  const text = document.querySelector('#loader .loading-text')
  if (text) {
    text.textContent = message
    text.classList.add('loading-text--error')
  }
}

const bootstrap = async () => {
  try {
    await bootstrapApplyMainChainContractsFromSlice()
  } catch (e) {
    showBootstrapFatal('链上合约配置获取失败（chain_info），页面无法启动。请检查索引服务或网络。', e)
    return
  }
  syncMainChainInkContracts()

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
}

void bootstrap()


declare global {
    interface Window {
        $toast: ReturnType<typeof import('@nuxt/ui/composables').useToast>;
        $app: any;
    }
}
