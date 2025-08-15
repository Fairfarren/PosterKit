import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { defineCustomElements } from 'designkit/loader'

const app = createApp(App)

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('kit-')

// 注册 designkit 的自定义元素
defineCustomElements()

app.mount('#root')
