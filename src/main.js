import './assets/pendings.css'
import './assets/style.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'

import router from '@/router'

import App from './App.vue'

const app = createApp(App);
app.use(router)
app.use(ElementPlus);
app.mount('#app')