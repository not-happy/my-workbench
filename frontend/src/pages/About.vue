<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">关于</h1>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            个人工作台
          </h2>
          
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            这是一个现代化的个人效率管理平台，基于Vue和Node.js构建。
            它展示了使用TypeScript、合理的项目结构和现代开发工具构建可扩展Web应用程序的最佳实践。
          </p>

          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                技术栈
              </h3>
              <div class="space-y-4">
                <div>
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">前端</h4>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 ml-4">
                    <li>• Vue 3</li>
                    <li>• TypeScript</li>
                    <li>• Vite</li>
                    <li>• Tailwind CSS</li>
                    <li>• Vue Router</li>
                    <li>• Axios</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">后端</h4>
                  <ul class="text-sm text-gray-600 dark:text-gray-400 ml-4">
                    <li>• Node.js</li>
                    <li>• Express.js</li>
                    <li>• TypeScript</li>
                    <li>• CORS</li>
                    <li>• Helmet</li>
                    <li>• Morgan</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                平台特性
              </h3>
              <ul class="text-gray-600 dark:text-gray-300 space-y-2">
                <li>• 完整的 TypeScript 支持</li>
                <li>• 现代 Vue Composition API</li>
                <li>• RESTful API 设计</li>
                <li>• 响应式设计</li>
                <li>• 错误处理机制</li>
                <li>• 开发就绪的配置</li>
                <li>• 热模块替换</li>
                <li>• ESLint 代码规范</li>
              </ul>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              快速开始
            </h3>
            <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                在开发模式下运行此应用程序：
              </p>
              <code class="text-sm bg-gray-800 text-green-400 p-2 rounded block">
                npm run install:all && npm run dev
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// About page component
</script>

<style scoped>
/* 保留代码块的特殊样式 */
code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>
