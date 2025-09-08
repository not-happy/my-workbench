import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'

// 懒加载页面组件
const Home = () => import('./pages/Home.vue')
const About = () => import('./pages/About.vue')
const JsonToJavaPage = () => import('./pages/tools/JsonToJavaPage.vue')
const SupplierTestPage = () => import('./pages/tools/SupplierTestPage.vue')
const StockMonitorPage = () => import('./pages/tools/StockMonitorPage.vue')

const routes = [
  { 
    path: '/', 
    component: Home,
    meta: { title: '首页' }
  },
  { 
    path: '/about', 
    component: About,
    meta: { title: '关于' }
  },
  { 
    path: '/tools/json-to-java', 
    component: JsonToJavaPage,
    meta: { 
      requiresToolbar: true, 
      title: 'JSON to Java 转换器',
      hideGlobalHeader: true
    }
  },
  { 
    path: '/tools/supplier-test', 
    component: SupplierTestPage,
    meta: { 
      requiresToolbar: true, 
      title: '供应商测试工具',
      hideGlobalHeader: true
    }
  },
  { 
    path: '/tools/stock-monitor', 
    component: StockMonitorPage,
    meta: { 
      requiresToolbar: true, 
      title: '股票盯盘助手',
      hideGlobalHeader: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
