<template>
  <div class="java-class-list h-full flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
    <!-- 简化的工具栏 -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Java类预览</h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ classes.length }} 个类</span>
          <!-- 显示当前配置信息 -->
          <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span v-if="packageName" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ packageName }}</span>
            <span v-if="rootClassName" class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">{{ rootClassName }}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="copyAllClasses"
            :disabled="classes.length === 0"
            class="text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-3 py-1 rounded relative transition-colors duration-200"
          >
            {{ copyStatus.all ? '✓ 已复制' : '复制全部' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 类列表 - 修复滚动 -->
    <div class="flex-1 overflow-y-auto">
      <div class="p-4 space-y-3">
        <div v-if="classes.length === 0" class="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div class="text-center">
            <p>暂无Java类</p>
            <p class="text-xs mt-1">请先生成Java代码</p>
          </div>
        </div>

        <div v-for="(classInfo, index) in classes" :key="index" class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-200">
          <!-- 简化的类头部 -->
          <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ classInfo.className }}</h3>
                <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                  {{ classInfo.fields?.length || 0 }} 字段
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="toggleClassExpanded(index)"
                  class="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors duration-200"
                >
                  {{ expandedClasses.has(index) ? '收起' : '展开' }}
                </button>
                <button
                  @click="copyClass(classInfo, index)"
                  class="text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded transition-colors duration-200"
                >
                  {{ copyStatus.individual.get(index) ? '✓ 已复制' : '复制' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 展开的类内容 -->
          <div v-if="expandedClasses.has(index)" class="p-4">
            <!-- 类名编辑 -->
            <div class="mb-4 flex items-center gap-2">
              <label class="text-sm text-gray-600 dark:text-gray-400">类名:</label>
              <input
                v-model="classInfo.className"
                @blur="updateClassName(index, classInfo.className)"
                @keyup.enter="updateClassName(index, classInfo.className)"
                class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
              />
            </div>

            <!-- 代码预览 -->
            <div class="bg-gray-900 dark:bg-gray-950 rounded p-3 overflow-auto max-h-96">
              <pre class="text-green-400 text-xs"><code>{{ getFullJavaCode(classInfo) }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props和Emits定义
interface JavaField {
  name: string
  type: string
  comment?: string
}

interface JavaClass {
  className: string
  fields: JavaField[]
  code: string
  packagePath?: string
}

interface Props {
  classes: JavaClass[]
  packageName?: string
  rootClassName?: string
  classPrefix?: string
}

interface Emits {
  (e: 'class-updated', classes: JavaClass[]): void
  (e: 'root-class-name-change', name: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const expandedClasses = ref(new Set<number>())
const copyStatus = ref({
  all: false,
  individual: new Map<number, boolean>()
})

// 展开/收起类
const toggleClassExpanded = (index: number) => {
  if (expandedClasses.value.has(index)) {
    expandedClasses.value.delete(index)
  } else {
    expandedClasses.value.add(index)
  }
}

// 生成完整的Java代码
const getFullJavaCode = (classInfo: JavaClass): string => {
  const packageDeclaration = props.packageName?.trim() 
    ? `package ${props.packageName};\n\n` 
    : ''
  
  const imports = [
    'import java.io.Serializable;',
    'import java.util.*;',
    'import java.math.BigDecimal;'
  ].join('\n')
  
  const classComment = `/**\n * @author xu yong\n * @since ${new Date().toLocaleDateString('zh-CN').replace(/\//g, '/')}\n */\n`
  
  const fieldsCode = classInfo.fields?.map(field => 
    `    private ${field.type} ${field.name};`
  ).join('\n') || ''
  
  const gettersSetters = classInfo.fields?.map(field => {
    const capitalizedName = field.name.charAt(0).toUpperCase() + field.name.slice(1)
    return `    public ${field.type} get${capitalizedName}() {\n        return ${field.name};\n    }\n\n    public void set${capitalizedName}(${field.type} ${field.name}) {\n        this.${field.name} = ${field.name};\n    }`
  }).join('\n\n') || ''
  
  return `${packageDeclaration}${imports}\n\n${classComment}public class ${classInfo.className} implements Serializable {\n    private static final long serialVersionUID = 1L;\n\n${fieldsCode}\n\n${gettersSetters}\n}`
}

// 更新类名
const updateClassName = (index: number, newName: string) => {
  if (!newName.trim()) return
  
  const updatedClasses = [...props.classes]
  const oldName = updatedClasses[index].className
  updatedClasses[index].className = newName.trim()
  
  // 更新所有类中的类型引用
  updatedClasses.forEach(cls => {
    cls.fields.forEach(field => {
      if (field.type === oldName) {
        field.type = newName.trim()
      } else if (field.type === `List<${oldName}>`) {
        field.type = `List<${newName.trim()}>`
      }
    })
  })
  
  emit('class-updated', updatedClasses)
}

// 复制单个类
const copyClass = async (classInfo: JavaClass, index?: number) => {
  try {
    const code = getFullJavaCode(classInfo)
    await navigator.clipboard.writeText(code)
    
    // 显示成功提示
    if (index !== undefined) {
      copyStatus.value.individual.set(index, true)
      setTimeout(() => {
        copyStatus.value.individual.set(index, false)
      }, 2000) // 2秒后恢复
    }
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 复制所有类
const copyAllClasses = async () => {
  try {
    const allCode = props.classes.map(classInfo => getFullJavaCode(classInfo)).join('\n\n// ============================\n\n')
    await navigator.clipboard.writeText(allCode)
    
    // 显示成功提示
    copyStatus.value.all = true
    setTimeout(() => {
      copyStatus.value.all = false
    }, 2000) // 2秒后恢复
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.java-class-list {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

pre code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}
</style>