<template>
  <div class="stock-monitor-page h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- 头部工具栏 -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">股票盯盘助手</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">短线交易实时监控工具</p>
            </div>
          </div>
        </div>
        
        <!-- 工具栏按钮 -->
        <div class="flex items-center gap-3">
          <button
            @click="refreshData"
            :disabled="isLoading"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isLoading ? '刷新中...' : '刷新数据' }}
          </button>
          
          <button
            @click="toggleAutoRefresh"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              autoRefresh 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            ]"
          >
            <div class="w-2 h-2 rounded-full" :class="autoRefresh ? 'bg-white animate-pulse' : 'bg-gray-400'"></div>
            {{ autoRefresh ? '自动刷新' : '手动刷新' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 overflow-hidden">
      <Suspense>
        <template #default>
          <StockMonitorTool />
        </template>
        <template #fallback>
          <div class="flex items-center justify-center h-64">
            <div class="text-center">
              <div class="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400">加载盯盘工具...</p>
            </div>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

// 懒加载组件
const StockMonitorTool = defineAsyncComponent(() => import('../../components/stock/StockMonitorTool.vue'))

// 响应式数据
const isLoading = ref(false)
const autoRefresh = ref(false)
const refreshTimer = ref<NodeJS.Timeout | null>(null)

// 刷新数据
const refreshData = async () => {
  isLoading.value = true
  try {
    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    isLoading.value = false
  }
}

// 切换自动刷新
const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  
  if (autoRefresh.value) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

// 开始自动刷新
const startAutoRefresh = () => {
  refreshTimer.value = setInterval(() => {
    refreshData()
  }, 10000) // 每10秒刷新一次
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value)
    refreshTimer.value = null
  }
}

// 组件挂载时
onMounted(() => {
  refreshData()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.stock-monitor-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
