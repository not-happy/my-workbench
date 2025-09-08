<template>
  <!-- 工作台主页 -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- 头部欢迎区域 -->
    <div class="container mx-auto px-4 py-8">
      <!-- Hero 区域 -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          欢迎来到个人工作台
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          您的专属工具中心，提升工作效率，简化日常任务
        </p>
        <div class="flex justify-center items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>今天是 {{ currentDate }}</span>
          </div>
          <div class="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <span>欢迎回来！</span>
        </div>
      </div>

      <!-- 快捷统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">可用工具</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ availableTools.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">今日使用</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ todayUsage }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">活跃工具</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ activeToolsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">工具分类</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ toolCategories.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 工具区域 -->
        <div class="lg:col-span-3">
          <!-- 工具搜索和过滤 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  工具中心
                  <span class="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">{{ availableTools.length }} 个工具</span>
                </h2>
                
                <!-- 搜索和筛选 -->
                <div class="flex flex-col sm:flex-row gap-3">
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                      v-model="searchQuery"
                      type="text" 
                      placeholder="搜索工具..." 
                      class="pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                  </div>
                  
                  
                  <!-- 美化的分类下拉框 -->
                  <div class="relative category-dropdown">
                    <button
                      @click="toggleCategoryDropdown"
                      class="flex items-center justify-between w-full sm:w-48 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span class="text-gray-900 dark:text-gray-100">
                          {{ selectedCategoryName || '所有分类' }}
                        </span>
                        <span v-if="selectedCategory" class="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          {{ getToolCountByCategory(selectedCategory) }}
                        </span>
                      </div>
                      <svg 
                        :class="['w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform', categoryDropdownOpen ? 'rotate-180' : '']" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <!-- 下拉菜单 -->
                    <div
                      v-show="categoryDropdownOpen"
                      class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-10 overflow-hidden"
                    >
                      <div class="py-2">
                        <!-- 所有分类选项 -->
                        <button
                          @click="selectCategory('')"
                          :class="[
                            'w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors',
                            !selectedCategory ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                          ]"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H3a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
                            </svg>
                            <span>所有分类</span>
                          </div>
                          <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                            {{ availableTools.length }}
                          </span>
                        </button>

                        <!-- 分类选项 -->
                        <button
                          v-for="category in toolCategories"
                          :key="category.id"
                          @click="selectCategory(category.id)"
                          :class="[
                            'w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors',
                            selectedCategory === category.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                          ]"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>{{ category.name }}</span>
                          </div>
                          <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                            {{ getToolCountByCategory(category.id) }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 工具网格 -->
            <div class="p-6">
              <div v-if="filteredTools.length === 0" class="text-center py-16">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.464-.64-6.32-1.76C3.456 12.316 2 10.253 2 8c0-2.123 1.456-4.184 3.68-5.24C7.536 1.64 9.66 1 12 1s4.464.64 6.32 1.76C20.544 3.816 22 5.877 22 8c0 2.253-1.456 4.316-3.68 5.24z" />
                  </svg>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">暂无工具</h3>
                <p class="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">没有找到匹配的工具，请尝试调整搜索条件。</p>
              </div>
              
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ToolCard
                  v-for="tool in filteredTools"
                  :key="tool.id"
                  :tool="tool"
                  @select="selectTool"
                  @launch="launchTool"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 最近使用的工具 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                最近使用
              </h3>
            </div>
            <div class="p-4">
              <div v-if="recentlyUsedTools.length === 0" class="text-center py-8">
                <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p class="text-gray-600 dark:text-gray-400 text-sm">暂无使用记录</p>
              </div>
              <div v-else class="space-y-2">
                <div 
                  v-for="tool in recentlyUsedTools" 
                  :key="tool.id"
                  class="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all border border-transparent group"
                  @click="launchTool(tool)"
                >
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-900 dark:group-hover:text-blue-300">{{ tool.name }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">{{ formatLastUsed(tool.lastUsed!) }}</p>
                  </div>
                  <svg class="w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div class="p-6 border-b border-gray-200 dark:border-gray-600">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                快捷操作
              </h3>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <button 
                  class="w-full flex items-center p-3 text-left bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-all group border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                  @click="clearAllData"
                >
                  <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span class="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-300">清空使用记录</span>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">清除所有工具的使用统计</p>
                  </div>
                </button>
                
                <button 
                  class="w-full flex items-center p-3 text-left bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-xl transition-all group border border-transparent hover:border-green-200 dark:hover:border-green-700"
                  @click="exportToolData"
                >
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <span class="font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-900 dark:group-hover:text-green-300">导出工具配置</span>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">下载完整的工具配置数据</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { WorkbenchTool, ToolCategory } from '../../../shared/workbench-types'
import { ToolRegistry, initializeToolRegistry } from '../utils/toolRegistry'
import ToolCard from '../components/workbench/ToolCard.vue'

// Vue Router
const router = useRouter()

// 响应式数据
const currentDate = ref(new Date().toLocaleDateString('zh-CN'))
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTool = ref<WorkbenchTool | null>(null)

// 下拉框状态
const categoryDropdownOpen = ref(false)

// 使用 ref 来存储工具和分类数据，确保响应式
const availableTools = ref<WorkbenchTool[]>([])
const toolCategories = ref<ToolCategory[]>([])

// 统计数据
const todayUsage = ref(8)
const activeToolsCount = computed(() => availableTools.value.filter(tool => tool.status === 'active').length)

// 计算属性：选中分类的名称
const selectedCategoryName = computed(() => {
  if (!selectedCategory.value) return ''
  const category = toolCategories.value.find(cat => cat.id === selectedCategory.value)
  return category?.name || ''
})

// 过滤后的工具
const filteredTools = computed(() => {
  let tools = availableTools.value
  
  // 按分类过滤
  if (selectedCategory.value) {
    tools = tools.filter(tool => tool.category === selectedCategory.value)
  }
  
  // 按搜索查询过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tools = tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 按使用次数排序
  return tools.sort((a, b) => b.usage - a.usage)
})

// 最近使用的工具
const recentlyUsedTools = computed(() => {
  return availableTools.value
    .filter(tool => tool.lastUsed)
    .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
    .slice(0, 5)
})

// 方法
const selectTool = (tool: WorkbenchTool) => {
  selectedTool.value = tool
}

// 下拉框相关方法
const toggleCategoryDropdown = () => {
  categoryDropdownOpen.value = !categoryDropdownOpen.value
}

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
  categoryDropdownOpen.value = false
}

// 点击外部关闭下拉框
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.category-dropdown')) {
    categoryDropdownOpen.value = false
  }
}

const launchTool = (tool: WorkbenchTool) => {
  selectedTool.value = tool
  
  // 更新使用统计
  tool.usage += 1
  tool.lastUsed = new Date().toISOString().split('T')[0]
  
  // 根据工具类型导航到对应页面
  switch (tool.component) {
    case 'JsonToJavaConverter':
      router.push('/tools/json-to-java')
      break
    case 'SupplierTestTool':
      router.push('/tools/supplier-test')
      break
    case 'StockMonitorTool':
      router.push('/tools/stock-monitor')
      break
    default:
      // 未知工具类型，可以在这里添加日志或错误处理
      break
  }
}

const getToolCountByCategory = (categoryId: string) => {
  return availableTools.value.filter(tool => tool.category === categoryId).length
}

const formatLastUsed = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

const clearAllData = () => {
  if (confirm('确定要清空所有使用记录吗？')) {
    availableTools.value.forEach(tool => {
      tool.usage = 0
      tool.lastUsed = undefined
    })
  }
}

const exportToolData = () => {
  const data = {
    tools: availableTools.value,
    categories: toolCategories.value,
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `workbench-tools-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 初始化
onMounted(() => {
  initializeToolRegistry()
  
  // 初始化完成后，更新响应式数据
  availableTools.value = ToolRegistry.getAllTools()
  toolCategories.value = ToolRegistry.getAllCategories()
  
  // 添加点击外部关闭下拉框的监听器
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 简单的动画效果 */
.fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
