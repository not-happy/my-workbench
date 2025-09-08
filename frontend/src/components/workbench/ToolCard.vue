<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-200',
      'hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer group',
      'flex flex-col h-full',
      isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
    ]"
    @click="$emit('select', tool)"
  >
    <!-- 工具卡片头部 -->
    <div class="p-6 flex-1 flex flex-col">
      <div class="flex items-start space-x-4 flex-1">
        <!-- 工具图标 -->
        <div 
          :class="tool.iconBg" 
          class="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
        >
          <div v-html="tool.icon" class="w-6 h-6"></div>
        </div>
        
        <!-- 工具信息 -->
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ tool.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {{ tool.description }}
              </p>
            </div>
            
            <!-- 状态标识 -->
            <div class="flex items-center gap-2 ml-2 flex-shrink-0">
              <span 
                v-if="tool.status === 'beta'"
                class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full"
              >
                Beta
              </span>
              <span 
                v-if="tool.status === 'deprecated'"
                class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"
              >
                已弃用
              </span>
              <div 
                class="p-1 rounded text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors"
                :title="getDisplayModeTitle(tool.displayMode)"
              >
                <svg v-if="tool.displayMode === 'fullscreen'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
                <svg v-else-if="tool.displayMode === 'modal'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10h8V11m-8 0H4a2 2 0 00-2 2v6a2 2 0 002 2h2m8-10V9a2 2 0 00-2-2H10a2 2 0 00-2 2v2"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 标签 -->
          <div class="flex flex-wrap gap-1 mt-auto pt-3">
            <span 
              v-for="tag in tool.tags.slice(0, 3)" 
              :key="tag"
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
            >
              {{ tag }}
            </span>
            <span 
              v-if="tool.tags.length > 3"
              class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-500 rounded-md"
            >
              +{{ tool.tags.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 工具卡片底部 -->
    <div class="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ tool.lastUsed ? formatDate(tool.lastUsed) : '未使用' }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>使用 {{ tool.usage }} 次</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 dark:text-gray-500">v{{ tool.version }}</span>
          <button
            @click.stop="$emit('launch', tool)"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              'bg-blue-500 hover:bg-blue-600 text-white',
              'group-hover:bg-blue-600'
            ]"
          >
            启动
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkbenchTool } from '../../../../shared/workbench-types'

interface Props {
  tool: WorkbenchTool
  isSelected?: boolean
}

interface Emits {
  (e: 'select', tool: WorkbenchTool): void
  (e: 'launch', tool: WorkbenchTool): void
}

withDefaults(defineProps<Props>(), {
  isSelected: false
})

defineEmits<Emits>()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  return date.toLocaleDateString('zh-CN')
}

// 获取显示模式说明
const getDisplayModeTitle = (mode: string) => {
  const titles = {
    'fullscreen': '全屏显示',
    'modal': '弹窗显示',
    'inline': '内嵌显示'
  }
  return titles[mode as keyof typeof titles] || '未知模式'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
