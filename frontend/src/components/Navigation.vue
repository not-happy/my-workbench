<template>
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- Logo 和品牌区域 -->
        <div class="flex items-center gap-4">
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">个人工作台</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400 -mt-1">Personal Workbench</p>
            </div>
          </router-link>
        </div>
        
        <!-- 导航菜单 -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            to="/"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-sm',
              'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400',
              'hover:bg-blue-50 dark:hover:bg-gray-800',
              isActive('/') 
                ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                : 'hover:translate-y-[-1px]'
            ]"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4M8 11V7"></path>
              </svg>
              工作台
            </div>
          </router-link>
          
          <!-- 工具下拉菜单 -->
          <div class="relative group">
            <button 
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
                isToolsActive 
                  ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              工具
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div class="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-[-8px] group-hover:translate-y-0 z-50 overflow-hidden backdrop-blur-sm">
              <div class="p-2">
                <router-link
                  to="/tools/json-to-java"
                  class="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 hover:translate-x-1"
                >
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">JSON to Java</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">代码转换工具</div>
                  </div>
                </router-link>
                <router-link
                  to="/tools/supplier-test"
                  class="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 hover:translate-x-1"
                >
                  <div class="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                    <svg class="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium">供应商测试</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">接口测试工具</div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          
          <router-link
            to="/about"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-sm',
              'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400',
              'hover:bg-blue-50 dark:hover:bg-gray-800',
              isActive('/about') 
                ? 'bg-blue-500 text-white shadow-md transform scale-105' 
                : 'hover:translate-y-[-1px]'
            ]"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              关于
            </div>
          </router-link>
        </div>

        <!-- 主题切换和移动端菜单按钮 -->
        <div class="flex items-center gap-2">
          <!-- 主题切换按钮 -->
          <ThemeToggle />
          
          <!-- 移动端菜单按钮 -->
          <div class="md:hidden">
            <button
              @click="toggleMobileMenu"
              class="p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div v-show="showMobileMenu" class="md:hidden bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div class="p-4 space-y-2">
          <router-link
            to="/"
            @click="closeMobileMenu"
            :class="[
              'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400',
              'hover:bg-white dark:hover:bg-gray-700',
              isActive('/') 
                ? 'bg-blue-500 text-white' 
                : ''
            ]"
          >
            工作台
          </router-link>
          <router-link
            to="/tools/json-to-java"
            @click="closeMobileMenu"
            class="block px-4 py-3 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700"
          >
            JSON to Java 转换器
          </router-link>
          <router-link
            to="/tools/supplier-test"
            @click="closeMobileMenu"
            class="block px-4 py-3 rounded-lg text-sm transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700"
          >
            供应商测试工具
          </router-link>
          <router-link
            to="/about"
            @click="closeMobileMenu"
            :class="[
              'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400',
              'hover:bg-white dark:hover:bg-gray-700',
              isActive('/about') 
                ? 'bg-blue-500 text-white' 
                : ''
            ]"
          >
            关于
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './ui/ThemeToggle.vue'

const route = useRoute()
const showMobileMenu = ref(false)

const isActive = (path: string) => {
  return route.path === path
}

// 判断是否在工具页面
const isToolsActive = computed(() => {
  return route.path.startsWith('/tools/')
})

// 移动端菜单控制
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>

<style scoped>
/* 导航栏动画效果 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

/* 下拉菜单的显示隐藏动画 */
.group:hover > div > div {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* 移动端菜单滑动动画 */
.mobile-menu {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 确保过渡效果平滑 */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
