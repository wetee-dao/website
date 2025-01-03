import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import pop from './plugins/pop'
import chain from './plugins/chain'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(pop)
    .use(chain)
app.mount('#app')

declare global {
    interface Window {
        $notification: any;
        $app: any;
    }
}
