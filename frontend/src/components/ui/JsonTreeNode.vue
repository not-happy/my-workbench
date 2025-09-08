<template>
  <div class="json-node">
    <!-- 对象或数组节点 -->
    <div v-if="isComplexType" class="object-node">
      <div class="node-header flex items-center gap-2 py-1 hover:bg-gray-100 rounded group">
        <!-- 展开/收起按钮 -->
        <button
          @click="toggleExpanded"
          class="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <svg
            :class="{ 'rotate-90': isExpanded }"
            class="w-3 h-3 transform transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- 键名（如果有） -->
        <span v-if="nodeKey !== null" class="node-key font-medium text-blue-600">
          "{{ nodeKey }}"
        </span>
        <span v-if="nodeKey !== null" class="text-gray-500">:</span>

        <!-- 值类型指示器 -->
        <span class="value-type text-gray-500 text-sm">
          {{ isArray ? '[' : '{' }}
        </span>
        <span v-if="!isExpanded" class="text-gray-400 text-sm">
          {{ isArray ? `${getArrayLength()} items` : `${getObjectKeysLength()} properties` }}
        </span>
        <span v-if="!isExpanded" class="value-type text-gray-500 text-sm">
          {{ isArray ? ']' : '}' }}
        </span>

        <!-- 复制按钮 -->
        <button
          @click.stop="copyCurrentNode"
          class="opacity-0 group-hover:opacity-100 ml-auto p-1 text-gray-400 hover:text-gray-600 transition-opacity"
          title="复制此节点"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <!-- 子节点 -->
      <div v-if="isExpanded" class="node-children ml-6 border-l border-gray-200 pl-4">
        <template v-if="isArray">
          <JsonTreeNode
            v-for="(item, index) in getArrayItems()"
            :key="index"
            :data="item"
            :node-key="index.toString()"
            :path="[...path, index.toString()]"
            :expanded-nodes="expandedNodes"
            @toggle-node="$emit('toggle-node', $event)"
            @copy-node="$emit('copy-node', $event)"
          />
        </template>
        <template v-else>
          <JsonTreeNode
            v-for="[key, value] in getObjectEntries()"
            :key="key"
            :data="value"
            :node-key="key"
            :path="[...path, key]"
            :expanded-nodes="expandedNodes"
            @toggle-node="$emit('toggle-node', $event)"
            @copy-node="$emit('copy-node', $event)"
          />
        </template>
        
        <!-- 闭合标签 -->
        <div class="text-gray-500 text-sm -ml-4 pl-4">
          {{ isArray ? ']' : '}' }}
        </div>
      </div>
    </div>

    <!-- 基本值节点 -->
    <div v-else class="primitive-node flex items-center gap-2 py-1 hover:bg-gray-100 rounded group">
      <div class="w-4"></div> <!-- 占位符，保持对齐 -->
      
      <!-- 键名（如果有） -->
      <span v-if="nodeKey !== null" class="node-key font-medium text-blue-600">
        "{{ nodeKey }}"
      </span>
      <span v-if="nodeKey !== null" class="text-gray-500">:</span>

      <!-- 值 -->
      <span :class="valueClass">{{ formattedValue }}</span>

      <!-- 复制按钮 -->
      <button
        @click.stop="copyCurrentNode"
        class="opacity-0 group-hover:opacity-100 ml-auto p-1 text-gray-400 hover:text-gray-600 transition-opacity"
        title="复制此值"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data: any
  nodeKey?: string | number | null
  path: (string | number)[]
  expandedNodes: Set<string>
}

interface Emits {
  (e: 'toggle-node', path: (string | number)[]): void
  (e: 'copy-node', data: any): void
}

const props = withDefaults(defineProps<Props>(), {
  nodeKey: null
})

const emit = defineEmits<Emits>()

// 计算属性
const isArray = computed(() => {
  return Array.isArray(props.data)
})

const isObject = computed(() => {
  return typeof props.data === 'object' && props.data !== null && !Array.isArray(props.data)
})

const isComplexType = computed(() => {
  return isArray.value || isObject.value
})

const currentPath = computed(() => {
  return props.path.length === 0 ? 'root' : props.path.join('.')
})

const isExpanded = computed(() => {
  return props.expandedNodes.has(currentPath.value)
})

// 获取数组长度
const getArrayLength = () => {
  return isArray.value ? props.data.length : 0
}

// 获取对象键的数量
const getObjectKeysLength = () => {
  return isObject.value ? Object.keys(props.data).length : 0
}

// 获取数组项
const getArrayItems = () => {
  return isArray.value ? props.data : []
}

// 获取对象条目
const getObjectEntries = () => {
  return isObject.value ? Object.entries(props.data) : []
}

const valueClass = computed(() => {
  const type = typeof props.data
  switch (type) {
    case 'string':
      return 'text-green-600'
    case 'number':
      return 'text-blue-600'
    case 'boolean':
      return 'text-purple-600'
    default:
      return 'text-gray-500'
  }
})

const formattedValue = computed(() => {
  if (props.data === null) return 'null'
  if (typeof props.data === 'string') return `"${props.data}"`
  if (typeof props.data === 'undefined') return 'undefined'
  return String(props.data)
})

// 方法
const toggleExpanded = () => {
  emit('toggle-node', props.path)
}

const copyCurrentNode = () => {
  emit('copy-node', props.data)
}
</script>

<style scoped>
.rotate-90 {
  transform: rotate(90deg);
}
</style>
