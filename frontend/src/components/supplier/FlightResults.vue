<template>
  <div class="space-y-4">
    <div v-if="routes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      </svg>
      <p>暂无搜索结果</p>
    </div>

    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">搜索结果 ({{ routes.length }} 条)</h3>
        <div class="flex gap-2">
          <button
            @click="expandAll"
            class="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-700 dark:text-gray-300 transition-colors duration-200"
          >
            展开全部
          </button>
          <button
            @click="collapseAll"
            class="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-1 rounded text-gray-700 dark:text-gray-300 transition-colors duration-200"
          >
            收起全部
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="(route, index) in routes"
          :key="index"
          :class="[
            'border rounded-lg hover:shadow-md transition-shadow',
            selectedRoute === route 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          ]"
        >
          <!-- 航线头部信息 -->
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-4">
                  <!-- 路线编号 -->
                  <div class="flex-shrink-0">
                    <span class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                      {{ index }}
                    </span>
                  </div>
                  
                  <!-- 航线基本信息 -->
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ getRouteTitle(route) }}
                      </span>
                      <span class="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                        {{ route.flightClass }}
                      </span>
                      <span class="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                        {{ route.ds }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      {{ getFlightDuration(route) }} · {{ getStopInfo(route) }}
                    </div>
                  </div>

                  <!-- 价格信息 -->
                  <div class="text-right">
                    <div class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ formatPrice(route) }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">含税价</div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center gap-2 ml-4">
                <button
                  @click="selectRoute(route)"
                  :class="[
                    'px-3 py-1 rounded text-sm font-medium transition-colors duration-200',
                    selectedRoute === route
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ selectedRoute === route ? '已选中' : '选择' }}
                </button>
                <button
                  @click="toggleExpand(index)"
                  class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                >
                  <svg
                    :class="['w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform', expandedRoutes.has(index) ? 'rotate-180' : '']"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 展开的详细信息 -->
          <div v-if="expandedRoutes.has(index)" class="border-t bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
            <div class="p-4 space-y-4">
              <!-- 航班段详情 -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">航班详情</h4>
                <div class="space-y-3">
                  <div
                    v-for="(segment, segIndex) in route.fromSegments"
                    :key="segIndex"
                    class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <div class="text-center">
                          <div class="text-lg font-bold text-gray-900 dark:text-white">{{ segment.flightNumber }}</div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">{{ segment.carrier }}</div>
                        </div>
                        <div class="flex items-center gap-6">
                          <div class="text-center">
                            <div class="font-semibold text-gray-900 dark:text-white">{{ formatTime(segment.depTime) }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">{{ segment.depAirport }}</div>
                          </div>
                          <div class="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                            <div class="h-px bg-gray-300 dark:bg-gray-600 w-8"></div>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                            <div class="h-px bg-gray-300 dark:bg-gray-600 w-8"></div>
                          </div>
                          <div class="text-center">
                            <div class="font-semibold text-gray-900 dark:text-white">{{ formatTime(segment.arrTime) }}</div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">{{ segment.arrAirport }}</div>
                          </div>
                        </div>
                      </div>
                      <div class="text-right text-sm text-gray-600 dark:text-gray-400">
                        <div>{{ segment.flightTime }}分钟</div>
                        <div>{{ segment.aircraftCode }}</div>
                        <div>余{{ segment.seatsRemain }}座</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 行李信息 -->
              <div v-if="route.baggage?.length">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">行李额度</h4>
                <div class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">托运行李：</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ route.baggage[0]?.adultPieces }} / {{ route.baggage[0]?.adultWeights }}</span>
                    </div>
                    <div>
                      <span class="text-gray-600 dark:text-gray-400">手提行李：</span>
                      <span class="font-medium text-gray-900 dark:text-white">{{ route.cabinBaggage?.[0]?.adultQuantity }} / {{ route.cabinBaggage?.[0]?.adultWeight }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 退改规则 -->
              <div v-if="route.rule?.refunds?.length || route.rule?.changes?.length">
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">退改规则</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- 退票规则 -->
                  <div v-if="route.rule?.refunds?.length" class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <svg class="w-4 h-4 mr-1 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      退票规则
                    </h5>
                    <div class="space-y-2">
                      <div
                        v-for="(refund, refundIndex) in route.rule.refunds"
                        :key="refundIndex"
                        class="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded"
                      >
                        <div class="flex items-center justify-between mb-1">
                          <span class="font-medium text-gray-900 dark:text-white">{{ getRefundTypeText(refund.refundType) }}</span>
                          <span :class="getRefundStatusClass(refund.refundStatus)">
                            {{ getRefundStatusText(refund.refundStatus) }}
                          </span>
                        </div>
                        <div v-if="refund.refundFee && refund.refundStatus === 'H'" class="text-gray-600 dark:text-gray-400">
                          退票费: {{ refund.refundFee }} {{ refund.currency || 'CNY' }}
                        </div>
                        <div v-if="refund.remark" class="text-gray-600 dark:text-gray-400 mt-1">
                          {{ refund.remark }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 改期规则 -->
                  <div v-if="route.rule?.changes?.length" class="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600">
                    <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                      <svg class="w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                      改期规则
                    </h5>
                    <div class="space-y-2">
                      <div
                        v-for="(change, changeIndex) in route.rule.changes"
                        :key="changeIndex"
                        class="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded"
                      >
                        <div class="flex items-center justify-between mb-1">
                          <span class="font-medium text-gray-900 dark:text-white">{{ getChangeTypeText(change.changeType) }}</span>
                          <span :class="getChangeStatusClass(change.changeStatus)">
                            {{ getChangeStatusText(change.changeStatus) }}
                          </span>
                        </div>
                        <div v-if="change.changeFee && change.changeStatus === 'H'" class="text-gray-600 dark:text-gray-400">
                          改期费: {{ change.changeFee }} {{ change.currency || 'CNY' }}
                        </div>
                        <div v-if="change.remark" class="text-gray-600 dark:text-gray-400 mt-1">
                          {{ change.remark }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 快捷操作 -->
              <div class="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <button
                  @click="handleAction('priceVerify', route)"
                  class="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                >
                  验价
                </button>
                <button
                  @click="handleAction('baggageQuery', route)"
                  class="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                >
                  查询行李
                </button>
                <button
                  @click="handleAction('seatMap', route)"
                  class="flex-1 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                >
                  查询选座
                </button>
                <button
                  @click="handleAction('createOrder', route)"
                  class="flex-1 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors duration-200"
                >
                  生单
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
import { ref } from 'vue'
import type { FlightRoute } from '../../../../shared/supplier-types'

interface Props {
  routes: FlightRoute[]
  selectedRoute?: FlightRoute | null
}

interface Emits {
  (e: 'select-route', route: FlightRoute): void
  (e: 'action', action: string, route: FlightRoute): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedRoute: null
})

const emit = defineEmits<Emits>()

// 展开状态管理
const expandedRoutes = ref<Set<number>>(new Set())

// 方法
const selectRoute = (route: FlightRoute) => {
  emit('select-route', route)
}

const handleAction = (action: string, route: FlightRoute) => {
  emit('action', action, route)
}

const toggleExpand = (index: number) => {
  if (expandedRoutes.value.has(index)) {
    expandedRoutes.value.delete(index)
  } else {
    expandedRoutes.value.add(index)
  }
}

const expandAll = () => {
  props.routes.forEach((_, index) => {
    expandedRoutes.value.add(index)
  })
}

const collapseAll = () => {
  expandedRoutes.value.clear()
}

// 格式化函数
const getRouteTitle = (route: FlightRoute) => {
  if (!route.fromSegments?.length) return '未知航线'
  const first = route.fromSegments[0]
  const last = route.fromSegments[route.fromSegments.length - 1]
  return `${first.depCity} → ${last.arrCity}`
}

const getFlightDuration = (route: FlightRoute) => {
  if (!route.fromSegments?.length) return ''
  const totalMinutes = route.fromSegments.reduce((total, segment) => {
    return total + parseInt(segment.flightTime || '0')
  }, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}小时${minutes}分钟`
}

const getStopInfo = (route: FlightRoute) => {
  if (!route.fromSegments?.length) return ''
  const stops = route.fromSegments.length - 1
  return stops === 0 ? '直飞' : `${stops}次中转`
}

const formatPrice = (_route: FlightRoute) => {
  // TODO: 从route数据中提取实际价格
  return '¥ 待确认'
}

const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 退票规则相关方法
const getRefundTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    0: '客票全部未使用',
    1: '客票部分使用', 
    2: 'NoShow起飞前退票',
    3: 'NoShow起飞后退票'
  }
  return typeMap[type] || '未知类型'
}

const getRefundStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'T': '不可退',
    'H': '有条件退',
    'F': '免费退',
    'E': '异常'
  }
  return statusMap[status] || status
}

const getRefundStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'T': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded text-xs',
    'H': 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-1 py-0.5 rounded text-xs',
    'F': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1 py-0.5 rounded text-xs',
    'E': 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-1 py-0.5 rounded text-xs'
  }
  return classMap[status] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-1 py-0.5 rounded text-xs'
}

// 改期规则相关方法
const getChangeTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    0: '起飞前改期',
    1: '起飞后改期',
    2: 'NoShow起飞前改期', 
    3: 'NoShow起飞后改期'
  }
  return typeMap[type] || '未知类型'
}

const getChangeStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'T': '不可改期',
    'H': '有条件改期',
    'F': '免费改期', 
    'E': '异常'
  }
  return statusMap[status] || status
}

const getChangeStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'T': 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded text-xs',
    'H': 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-1 py-0.5 rounded text-xs',
    'F': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1 py-0.5 rounded text-xs',
    'E': 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-1 py-0.5 rounded text-xs'
  }
  return classMap[status] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-1 py-0.5 rounded text-xs'
}
</script>
