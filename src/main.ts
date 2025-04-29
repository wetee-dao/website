import './assets/main.scss'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pop from './plugins/pop'
import chain, { chainNetPing, chainUrls } from './plugins/chain'
import { store, useGlobalStore } from './stores/global'

const m = () => {
    const app = createApp(App)

    app.use(store)
    app.use(router)
    app.use(pop)
        .use(chain)
    app.mount('#app')
}

const ins = useGlobalStore(store)
if (ins.chainUrl) {
    m()
} else {
    chainNetPing().then((index) => {
        console.log("index ", index)
        ins.setChainUrl(chainUrls()[index])
        m()
    })
}


declare global {
    interface Window {
        $notification: any;
        $app: any;
    }
}
