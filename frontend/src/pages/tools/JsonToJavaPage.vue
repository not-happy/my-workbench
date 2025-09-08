<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
    <!-- 页面级导航栏 -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transition-colors duration-200">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center gap-3">
            <button
              @click="goHome"
              class="flex items-center gap-2 transition-all duration-300 px-3 py-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:scale-105"
              title="返回工作台"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="text-sm font-medium">工作台</span>
            </button>
            <div class="h-5 w-px bg-gray-200 dark:bg-gray-600"></div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">JSON to Java 转换器</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">快速将 JSON 数据转换为 Java 类定义</p>
              </div>
              <!-- 工具标签 -->
              <div class="flex flex-wrap gap-2 ml-6">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
                  代码生成
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm">
                  数据转换
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                  开发工具
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- 主题切换按钮 -->
            <ThemeToggle />
            <span class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{{ $route.path }}</span>
          </div>
        </div>
      </div>
    </header>
    
    <div class="container mx-auto px-4 py-6">
      <!-- 工具主体 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <Suspense>
          <template #default>
            <JsonToJavaConverter />
          </template>
          <template #fallback>
            <div class="flex items-center justify-center p-16">
              <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                  <svg class="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">加载工具中...</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">正在初始化 JSON to Java 转换器</p>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '../../components/ui/ThemeToggle.vue'

// 懒加载 JsonToJavaConverter 组件
const JsonToJavaConverter = defineAsyncComponent(() => 
  import('../../components/workbench/JsonToJavaConverter.vue')
)

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
/* 确保过渡效果平滑 */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* 按钮hover效果 */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>
