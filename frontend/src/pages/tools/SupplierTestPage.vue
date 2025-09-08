<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
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
              <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900 dark:text-white">供应商测试工具</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">测试和验证供应商接口的可靠性</p>
              </div>
              <!-- 工具标签 -->
              <div class="flex flex-wrap gap-2 ml-6">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm">
                  接口测试
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
                  数据验证
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-sm">
                  质量保证
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
        <SupplierTestTool />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import SupplierTestTool from '../../components/workbench/SupplierTestTool.vue'
import ThemeToggle from '../../components/ui/ThemeToggle.vue'

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
