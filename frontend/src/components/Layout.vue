<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- 主导航栏 - 根据页面配置决定是否显示 -->
    <header v-if="!shouldHideGlobalHeader" class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transition-colors duration-200">
      <Navigation />
      
      <!-- 工具页面的二级导航栏 -->
      <div v-if="isToolPage" class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-3">
              <button
                @click="goHome"
                class="flex items-center gap-2 transition-colors px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700"
                title="返回工作台"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span class="text-sm font-medium">返回工作台</span>
              </button>
              <div class="h-4 w-px bg-gray-200 dark:bg-gray-600"></div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <h1 class="text-sm font-medium text-gray-900 dark:text-white">{{ getToolTitle() }}</h1>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{{ getCurrentPath() }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navigation from './Navigation.vue'

const route = useRoute()
const router = useRouter()

// 判断是否为工具页面
const isToolPage = computed(() => {
  return route.meta?.requiresToolbar === true
})

// 判断是否应该隐藏全局header
const shouldHideGlobalHeader = computed(() => {
  return route.meta?.hideGlobalHeader === true
})

// 返回首页
const goHome = () => {
  router.push('/')
}

// 获取工具标题
const getToolTitle = () => {
  return route.meta?.title || '工具'
}

// 获取当前路径
const getCurrentPath = () => {
  return route.path
}
</script>

<style scoped>
/* Layout 动画和过渡效果 */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* 工具栏按钮hover效果 */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* 状态指示器动画 */
.w-2.h-2.bg-green-500 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
