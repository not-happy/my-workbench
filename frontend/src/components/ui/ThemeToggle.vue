<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg transition-colors duration-200 
           bg-gray-100 hover:bg-gray-200 
           dark:bg-gray-800 dark:hover:bg-gray-700
           text-gray-700 dark:text-gray-300"
    :aria-label="theme === 'light' ? '切换到深色模式' : '切换到浅色模式'"
    title="切换主题"
  >
    <!-- 太阳图标 (浅色模式) -->
    <svg
      v-if="theme === 'light'"
      class="w-5 h-5 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <!-- 月亮图标 (深色模式) -->
    <svg
      v-else
      class="w-5 h-5 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<style scoped>
/* 添加平滑的主题切换过渡效果 */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}
</style>
