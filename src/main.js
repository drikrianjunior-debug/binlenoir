import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { init } from './store'
import { loadCatalog } from './catalog'
import { loadRates } from './i18n'
import './style.css'
loadRates()
Promise.all([init(), loadCatalog()]).finally(() => createApp(App).use(router).mount('#app'))
