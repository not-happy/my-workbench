<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- 基础信息 -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">出发城市</label>
        <input
          v-model="form.fromCity"
          type="text"
          placeholder="如: MNL"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">到达城市</label>
        <input
          v-model="form.toCity"
          type="text"
          placeholder="如: KUL"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
        />
      </div>
    </div>

    <!-- 日期和行程类型 -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">出发日期</label>
        <input
          v-model="form.fromDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">返程日期</label>
        <input
          v-model="form.retDate"
          type="date"
          :disabled="form.tripType === 'one-way'"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        />
      </div>
    </div>

    <!-- 行程类型 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">行程类型</label>
      <div class="flex gap-4">
        <label class="flex items-center">
          <input
            v-model="form.tripType"
            type="radio"
            value="round-trip"
            class="text-blue-600 focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-400"
          />
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">往返</span>
        </label>
        <label class="flex items-center">
          <input
            v-model="form.tripType"
            type="radio"
            value="one-way"
            class="text-blue-600 focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-400"
          />
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">单程</span>
        </label>
      </div>
    </div>

    <!-- 乘客信息 -->
    <div class="grid grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">成人数量</label>
        <select
          v-model="form.adultNum"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        >
          <option v-for="num in 9" :key="num" :value="num">{{ num }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">儿童数量</label>
        <select
          v-model="form.childNum"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        >
          <option v-for="num in 9" :key="num" :value="num">{{ num }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">婴儿数量</label>
        <select
          v-model="form.infantNum"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        >
          <option v-for="num in 9" :key="num" :value="num">{{ num }}</option>
        </select>
      </div>
    </div>

    <!-- 舱位等级 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">舱位等级</label>
      <select
        v-model="form.cabinClass"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
      >
        <option value="economy">经济舱</option>
        <option value="business">商务舱</option>
        <option value="first">头等舱</option>
      </select>
    </div>

    <!-- 货币和语言 -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">货币</label>
        <select
          v-model="form.currency"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        >
          <option value="CNY">CNY - 人民币</option>
          <option value="USD">USD - 美元</option>
          <option value="EUR">EUR - 欧元</option>
          <option value="GBP">GBP - 英镑</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">语言</label>
        <select
          v-model="form.language"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
        >
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
          <option value="ko-KR">한국어</option>
        </select>
      </div>
    </div>

    <!-- 供应商选择 -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">供应商</label>
      <div class="grid grid-cols-2 gap-2">
        <label 
          v-for="supplier in availableSuppliers" 
          :key="supplier"
          class="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600': form.suppliers.includes(supplier) }"
        >
          <input
            type="checkbox"
            :value="supplier"
            v-model="form.suppliers"
            class="text-blue-600 focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-400"
          />
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ supplier }}</span>
        </label>
      </div>
    </div>

    <!-- 搜索按钮 -->
    <div class="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        type="submit"
        :disabled="!isFormValid || isLoading"
        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 dark:focus:ring-offset-gray-800"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          搜索中...
        </span>
        <span v-else>搜索航班</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FlightSearchParams } from '../../../../shared/supplier-types'

interface Props {
  isLoading?: boolean
}

interface Emits {
  (e: 'search', params: FlightSearchParams): void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<Emits>()

// 可用供应商列表
const availableSuppliers = ['Amadeus', 'Sabre', 'Travelport', 'DirectConnect']

// 表单数据
const form = ref<FlightSearchParams>({
  fromCity: 'MNL',
  toCity: 'KUL',
  fromDate: '',
  retDate: '',
  tripType: 'round-trip',
  adultNum: 1,
  childNum: 0,
  infantNum: 0,
  cabinClass: 'economy',
  currency: 'CNY',
  language: 'zh-CN',
  suppliers: ['Amadeus']
})

// 计算属性：表单验证
const isFormValid = computed(() => {
  return (
    form.value.fromCity.trim() !== '' &&
    form.value.toCity.trim() !== '' &&
    form.value.fromDate !== '' &&
    (form.value.tripType === 'one-way' || form.value.retDate !== '') &&
    form.value.suppliers.length > 0
  )
})

// 监听行程类型变化，清空返程日期
watch(() => form.value.tripType, (newType) => {
  if (newType === 'one-way') {
    form.value.retDate = ''
  }
})

// 设置默认日期
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date(today)
nextWeek.setDate(nextWeek.getDate() + 7)

form.value.fromDate = tomorrow.toISOString().split('T')[0]
form.value.retDate = nextWeek.toISOString().split('T')[0]

// 提交表单
const handleSubmit = () => {
  if (isFormValid.value && !props.isLoading) {
    emit('search', { ...form.value })
  }
}
</script>