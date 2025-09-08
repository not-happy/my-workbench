<template>
  <div id="app" class="transition-colors duration-200">
    <Layout>
      <router-view />
    </Layout>
  </div>
</template>

<script setup lang="ts">
import Layout from './components/Layout.vue'
import { useTheme } from './composables/useTheme'

// 初始化主题系统
const { initTheme } = useTheme()
initTheme()
</script>

<style>
/* 全局样式已在 main.ts 中通过 index.css 引入 */
#app {
  min-height: 100vh;
}
</style>