<template>
  <div class="json-tree-viewer h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- 工具栏 -->
    <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-200">
      <h2 class="text-sm font-medium text-gray-900 dark:text-white">JSON结构</h2>
      <div class="flex gap-2">
        <button
          @click="expandAll"
          class="text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded transition-colors duration-200"
        >
          全部展开
        </button>
        <button
          @click="collapseAll"
          class="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition-colors duration-200"
        >
          全部收起
        </button>
        <button
          @click="formatJson"
          :disabled="!jsonInput.trim()"
          class="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:text-gray-400 dark:disabled:text-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition-colors duration-200"
        >
          格式化
        </button>
        <button
          @click="loadExample"
          class="text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded transition-colors duration-200"
        >
          示例
        </button>
      </div>
    </div>

    <!-- JSON输入区域 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
      <textarea
        v-model="jsonInput"
        placeholder="粘贴或输入您的JSON数据..."
        class="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
        :class="{ 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20': jsonError }"
      ></textarea>
      <div v-if="jsonError" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ jsonError }}
      </div>
    </div>

    <!-- JSON树形结构展示 -->
    <div class="flex-1 overflow-auto p-4 bg-white dark:bg-gray-800 transition-colors duration-200">
      <div v-if="!parsedJson" class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p>输入JSON数据查看树形结构</p>
        </div>
      </div>
      
      <div v-else class="json-tree">
        <JsonTreeNode
          :data="parsedJson"
          :path="[]"
          :expanded-nodes="expandedNodes"
          @toggle-node="toggleNode"
          @copy-node="copyNode"
        />
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="bg-gray-50 border-t px-4 py-2 flex-shrink-0">
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center gap-4">
          <span v-if="jsonInput.trim()">输入: {{ jsonInput.length }} 字符</span>
          <span v-if="parsedJson">节点: {{ countNodes(parsedJson) }} 个</span>
        </div>
        <div v-if="copyMessage" class="text-green-600">
          {{ copyMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import JsonTreeNode from './JsonTreeNode.vue'

interface Props {
  initialJson?: string
}

interface Emits {
  (e: 'json-change', value: any): void
  (e: 'json-input-change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  initialJson: ''
})

const emit = defineEmits<Emits>()

// 响应式数据
const jsonInput = ref(props.initialJson || '')
const jsonError = ref('')
const parsedJson = ref<any>(null)
const expandedNodes = ref<Set<string>>(new Set())
const copyMessage = ref('')

// 示例JSON数据
const exampleJson = `{
  "cid": "DIDA",
  "tripType": 1,
  "adultNumber": 1,
  "childNumber": 0,
  "isActive": true,
  "currency": "CNY",
  "searchSegments": [
    {
      "departure": "LON",
      "arrival": "SIN",
      "departureDate": "20231210",
      "price": 1299.99,
      "available": true
    }
  ],
  "userInfo": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "isVip": true,
    "age": 35
  }
}`

// 清理JSON注释的函数
const cleanJsonComments = (jsonString: string): string => {
  // 移除单行注释 // ...
  let cleaned = jsonString.replace(/\/\/.*$/gm, '')
  
  // 移除多行注释 /* ... */
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '')
  
  // 移除可能留下的多余逗号（在最后一个属性后）
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1')
  
  return cleaned
}

// 监听JSON输入变化
watch(jsonInput, (newValue) => {
  jsonError.value = ''
  emit('json-input-change', newValue)
  
  if (newValue.trim()) {
    try {
      // 清理注释后再解析
      const cleanedJson = cleanJsonComments(newValue)
      const parsed = JSON.parse(cleanedJson)
      parsedJson.value = parsed
      emit('json-change', parsed)
      // 默认展开第一层
      expandedNodes.value.clear()
      expandedNodes.value.add('root')
    } catch (error) {
      jsonError.value = `JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}`
      parsedJson.value = null
      emit('json-change', null)
    }
  } else {
    parsedJson.value = null
    emit('json-change', null)
  }
}, { immediate: true })

// 格式化JSON
const formatJson = () => {
  try {
    // 清理注释后再格式化
    const cleanedJson = cleanJsonComments(jsonInput.value)
    const parsed = JSON.parse(cleanedJson)
    jsonInput.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (error) {
    jsonError.value = `JSON格式错误: ${error instanceof Error ? error.message : '未知错误'}`
  }
}

// 加载示例
const loadExample = () => {
  jsonInput.value = exampleJson
  jsonError.value = ''
}

// 全部展开
const expandAll = () => {
  if (!parsedJson.value) return
  
  const addAllPaths = (obj: any, currentPath: string[] = []): void => {
    const pathKey = currentPath.length === 0 ? 'root' : currentPath.join('.')
    expandedNodes.value.add(pathKey)
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            addAllPaths(item, [...currentPath, index.toString()])
          }
        })
      } else {
        Object.keys(obj).forEach(key => {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            addAllPaths(obj[key], [...currentPath, key])
          }
        })
      }
    }
  }
  
  addAllPaths(parsedJson.value)
}

// 全部收起
const collapseAll = () => {
  expandedNodes.value.clear()
  expandedNodes.value.add('root') // 保持根节点展开
}

// 切换节点展开状态
const toggleNode = (path: (string | number)[]) => {
  const pathKey = path.length === 0 ? 'root' : path.join('.')
  if (expandedNodes.value.has(pathKey)) {
    expandedNodes.value.delete(pathKey)
  } else {
    expandedNodes.value.add(pathKey)
  }
}

// 复制节点数据
const copyNode = async (data: any) => {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    await navigator.clipboard.writeText(jsonString)
    copyMessage.value = '已复制到剪贴板'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    copyMessage.value = '复制失败'
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  }
}

// 计算节点数量
const countNodes = (obj: any): number => {
  if (typeof obj !== 'object' || obj === null) return 1
  
  let count = 1
  if (Array.isArray(obj)) {
    count += obj.reduce((sum: number, item: any) => sum + countNodes(item), 0)
  } else {
    count += Object.values(obj).reduce((sum: number, value: any) => sum + countNodes(value), 0)
  }
  return count
}

// 暴露方法给父组件
defineExpose({
  setJsonInput: (value: string) => {
    jsonInput.value = value
  },
  getParsedJson: () => parsedJson.value,
  getJsonInput: () => jsonInput.value
})
</script>

<style scoped>
.json-tree {
  font-family: 'Fira Code', 'Monaco', 'Consolas', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
}
</style>
