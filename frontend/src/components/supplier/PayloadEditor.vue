<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ getOperationLabel(operation) }} JSON Payload
      </label>
      <div class="flex gap-2">
        <button
          @click="formatJson"
          class="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          格式化
        </button>
        <button
          @click="pasteFromClipboard"
          class="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          粘贴
        </button>
        <button
          @click="copyToClipboard"
          class="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300 transition-colors duration-200"
        >
          复制
        </button>
        <button
          @click="loadTemplate"
          class="text-xs bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-2 py-1 rounded transition-colors duration-200"
        >
          加载模板
        </button>
      </div>
    </div>

    <!-- JSON 编辑器 -->
    <div class="relative">
      <textarea
        v-model="localValue"
        :placeholder="placeholder"
        rows="20"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
        :class="{ 'border-red-300 dark:border-red-600': hasError }"
      />
      
      <!-- 错误提示 -->
      <div v-if="hasError" class="mt-2 text-sm text-red-600 dark:text-red-400">
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        JSON 格式错误: {{ errorMessage }}
      </div>
    </div>

    <!-- 操作提示 -->
    <div v-if="operation" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg transition-colors duration-200">
      <div class="text-sm text-blue-800 dark:text-blue-400">
        <strong>{{ getOperationLabel(operation) }}操作说明：</strong>
        {{ getOperationDescription(operation) }}
      </div>
    </div>

    <!-- JSON 验证状态 -->
    <div class="flex items-center justify-between text-sm">
      <div class="flex items-center gap-2">
        <div
          :class="[
            'w-2 h-2 rounded-full',
            hasError ? 'bg-red-500' : 'bg-green-500'
          ]"
        ></div>
        <span :class="hasError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
          {{ hasError ? 'JSON 格式错误' : 'JSON 格式正确' }}
        </span>
      </div>
      <div class="text-gray-500 dark:text-gray-400">
        字符数: {{ localValue.length }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TestOperation } from '../../../../shared/supplier-types'

interface Props {
  modelValue: string
  placeholder?: string
  operation?: TestOperation
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入 JSON payload...',
  operation: undefined
})

const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)
const errorMessage = ref('')

// 计算属性
const hasError = computed(() => {
  if (!localValue.value.trim()) return false
  try {
    JSON.parse(localValue.value)
    errorMessage.value = ''
    return false
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
    return true
  }
})

// 监听本地值变化
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
})

// 方法
const formatJson = () => {
  try {
    const parsed = JSON.parse(localValue.value)
    localValue.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    // 如果格式化失败，保持原值
    console.warn('JSON 格式化失败:', error)
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(localValue.value)
    // TODO: 添加成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    localValue.value = text
  } catch (err) {
    console.error('粘贴失败:', err)
  }
}

const loadTemplate = () => {
  if (!props.operation) return
  
  const template = getOperationTemplate(props.operation)
  localValue.value = JSON.stringify(template, null, 2)
}

// 获取操作标签
const getOperationLabel = (operation?: TestOperation) => {
  if (!operation) return '通用'
  
  const labels: Record<TestOperation, string> = {
    'search': '搜索航班',
    'priceVerify': '验价',
    'baggageQuery': '查询行李',
    'seatMap': '查询选座',
    'createOrder': '生单',
    'paymentVerify': '支付校验',
    'issueTicket': '出票',
    'getTicketNumber': '获取票号'
  }
  
  return labels[operation] || operation
}

// 获取操作描述
const getOperationDescription = (operation: TestOperation) => {
  const descriptions: Record<TestOperation, string> = {
    'search': '输入搜索条件，包括出发地、目的地、日期、乘客数量等信息',
    'priceVerify': '使用航线的 data 字段进行验价，确认最新价格',
    'baggageQuery': '查询指定航线的行李政策和费用',
    'seatMap': '获取航班的座位图和可选座位信息',
    'createOrder': '创建订单，需要提供乘客信息和联系方式',
    'paymentVerify': '校验支付信息和订单状态',
    'issueTicket': '出票操作，生成电子客票',
    'getTicketNumber': '获取已出票的票号信息'
  }
  
  return descriptions[operation] || '执行相关操作'
}

// 获取操作模板
const getOperationTemplate = (operation: TestOperation) => {
  const templates: Record<TestOperation, object> = {
    'search': {
      cid: 'ray_flight',
      adultNumber: 1,
      childNumber: 0,
      flightClass: 'Economy',
      fromCity: 'MNL',
      toCity: 'KUL',
      fromDate: '2025-10-26',
      ds: 'SABRE',
      pcc: 'G5NJ',
      retDate: '',
      tripType: '1'
    },
    'priceVerify': {
      routeData: 'eyJoYXNKY2JGYXJlIjowfQ==',
      passengers: {
        adult: 1,
        child: 0
      }
    },
    'baggageQuery': {
      routeData: 'eyJoYXNKY2JGYXJlIjowfQ==',
      flightSegments: []
    },
    'seatMap': {
      routeData: 'eyJoYXNKY2JGYXJlIjowfQ==',
      flightNumber: 'VN646',
      departureDate: '2025-10-26'
    },
    'createOrder': {
      routeData: 'eyJoYXNKY2JGYXJlIjowfQ==',
      passengers: [
        {
          type: 'adult',
          firstName: 'John',
          lastName: 'Doe',
          gender: 'M',
          birthDate: '1990-01-01',
          passport: {
            number: 'A12345678',
            nationality: 'US',
            expireDate: '2030-01-01'
          }
        }
      ],
      contactInfo: {
        email: 'john.doe@example.com',
        phone: '1234567890',
        countryCode: '+1'
      }
    },
    'paymentVerify': {
      orderId: 'ORDER123456',
      paymentMethod: 'credit_card',
      amount: 500.00,
      currency: 'USD'
    },
    'issueTicket': {
      orderId: 'ORDER123456',
      pnr: 'ABC123',
      paymentConfirmed: true
    },
    'getTicketNumber': {
      orderId: 'ORDER123456',
      pnr: 'ABC123'
    }
  }
  
  return templates[operation] || {}
}
</script>
