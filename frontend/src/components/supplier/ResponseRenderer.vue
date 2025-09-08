<template>
  <div class="space-y-4">
    <!-- 根据操作类型渲染不同的内容 -->
    <div v-if="operation === 'search'" class="space-y-3">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">航线数量:</span>
          <span class="font-medium ml-2">{{ data.data?.routes?.length || 0 }}</span>
        </div>
        <div>
          <span class="text-gray-600">搜索耗时:</span>
          <span class="font-medium ml-2">{{ data.searchTime || 'N/A' }}ms</span>
        </div>
      </div>
      
      <!-- 退改规则统计 -->
      <div v-if="data.data?.routes?.length" class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">含退改规则:</span>
          <span class="font-medium ml-2">{{ getRoutesWithRulesCount(data.data.routes) }} / {{ data.data.routes.length }}</span>
        </div>
        <div>
          <span class="text-gray-600">平均规则数:</span>
          <span class="font-medium ml-2">{{ getAverageRulesCount(data.data.routes) }}</span>
        </div>
      </div>
      
      <!-- 如果有错误信息 -->
      <div v-if="data.message && !data.success" class="bg-red-50 border border-red-200 p-3 rounded">
        <p class="text-red-800 text-sm">{{ data.message }}</p>
      </div>

      <!-- 路线详情列表 -->
      <div v-if="data.data?.routes?.length" class="space-y-3">
        <h4 class="text-sm font-semibold text-gray-900">航线详情</h4>
        <div class="space-y-3">
          <div
            v-for="(route, index) in data.data.routes"
            :key="index"
            class="border rounded-lg bg-white"
          >
            <!-- 路线头部 -->
            <div class="p-4 border-b">
              <div class="flex items-center gap-4">
                <!-- 路线编号 -->
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {{ index }}
                  </span>
                </div>
                
                <!-- 基本信息 -->
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-lg font-semibold text-gray-900">
                      {{ getRouteTitle(route) }}
                    </span>
                    <span class="text-sm px-2 py-1 bg-gray-100 rounded text-gray-600">
                      {{ route.flightClass }}
                    </span>
                    <span class="text-sm px-2 py-1 bg-blue-100 rounded text-blue-600">
                      {{ route.ds }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ formatPrice(route) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 航班段信息 -->
            <div v-if="route.fromSegments?.length" class="p-4 border-b">
              <h5 class="text-sm font-medium text-gray-900 mb-2">航班信息</h5>
              <div class="space-y-2">
                <div
                  v-for="(segment, segIndex) in route.fromSegments"
                  :key="segIndex"
                  class="bg-gray-50 p-3 rounded text-sm"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <span class="font-semibold">{{ segment.flightNumber }}</span>
                      <span>{{ formatTime(segment.depTime) }} {{ segment.depCity }}</span>
                      <span class="text-gray-400">→</span>
                      <span>{{ formatTime(segment.arrTime) }} {{ segment.arrCity }}</span>
                    </div>
                    <span class="text-gray-600">{{ segment.flightTime }}分钟</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 退改规则 -->
            <div v-if="(route.refunds?.length || route.changes?.length) || (route.rule?.refunds?.length || route.rule?.changes?.length)" class="p-4">
              <h5 class="text-sm font-medium text-gray-900 mb-2">退改规则</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 退票规则 -->
                <div v-if="route.refunds?.length || route.rule?.refunds?.length" class="bg-gray-50 p-3 rounded">
                  <h6 class="text-xs font-medium text-gray-900 mb-2 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    退票规则
                  </h6>
                  <div class="space-y-2">
                    <!-- 支持旧格式 -->
                    <div
                      v-for="(refund, refundIndex) in (route.refunds || [])"
                      :key="'old-' + refundIndex"
                      class="text-xs bg-white p-2 rounded border"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-medium">{{ getRefundTypeText(refund.refundType) }}</span>
                        <span :class="getRefundStatusClass(refund.refundStatus)">
                          {{ getRefundStatusText(refund.refundStatus) }}
                        </span>
                      </div>
                      <div v-if="refund.refundFee && refund.refundStatus === 'H'" class="text-gray-600">
                        退票费: {{ refund.refundFee }} {{ refund.currency || 'CNY' }}
                      </div>
                      <div v-if="refund.remark" class="text-gray-600 mt-1">
                        {{ refund.remark }}
                      </div>
                    </div>
                    <!-- 支持新格式 -->
                    <div
                      v-for="(refund, refundIndex) in (route.rule?.refunds || [])"
                      :key="'new-' + refundIndex"
                      class="text-xs bg-white p-2 rounded border"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-medium">{{ getRefundTypeText(refund.refundType) }}</span>
                        <span :class="getRefundStatusClass(refund.refundStatus)">
                          {{ getRefundStatusText(refund.refundStatus) }}
                        </span>
                      </div>
                      <div v-if="refund.refundFee && refund.refundStatus === 'H'" class="text-gray-600">
                        退票费: {{ refund.refundFee }} {{ refund.currency || 'CNY' }}
                      </div>
                      <div v-if="refund.remark" class="text-gray-600 mt-1">
                        {{ refund.remark }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 改期规则 -->
                <div v-if="route.changes?.length || route.rule?.changes?.length" class="bg-gray-50 p-3 rounded">
                  <h6 class="text-xs font-medium text-gray-900 mb-2 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    改期规则
                  </h6>
                  <div class="space-y-2">
                    <!-- 支持旧格式 -->
                    <div
                      v-for="(change, changeIndex) in (route.changes || [])"
                      :key="'old-' + changeIndex"
                      class="text-xs bg-white p-2 rounded border"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-medium">{{ getChangeTypeText(change.changeType) }}</span>
                        <span :class="getChangeStatusClass(change.changeStatus)">
                          {{ getChangeStatusText(change.changeStatus) }}
                        </span>
                      </div>
                      <div v-if="change.changeFee && change.changeStatus === 'H'" class="text-gray-600">
                        改期费: {{ change.changeFee }} {{ change.currency || 'CNY' }}
                      </div>
                      <div v-if="change.remark" class="text-gray-600 mt-1">
                        {{ change.remark }}
                      </div>
                    </div>
                    <!-- 支持新格式 -->
                    <div
                      v-for="(change, changeIndex) in (route.rule?.changes || [])"
                      :key="'new-' + changeIndex"
                      class="text-xs bg-white p-2 rounded border"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="font-medium">{{ getChangeTypeText(change.changeType) }}</span>
                        <span :class="getChangeStatusClass(change.changeStatus)">
                          {{ getChangeStatusText(change.changeStatus) }}
                        </span>
                      </div>
                      <div v-if="change.changeFee && change.changeStatus === 'H'" class="text-gray-600">
                        改期费: {{ change.changeFee }} {{ change.currency || 'CNY' }}
                      </div>
                      <div v-if="change.remark" class="text-gray-600 mt-1">
                        {{ change.remark }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 验价结果 -->
    <div v-else-if="operation === 'priceVerify'" class="space-y-3">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">验价状态:</span>
          <span :class="[
            'font-medium ml-2',
            data.data?.priceValid ? 'text-green-600' : 'text-red-600'
          ]">
            {{ data.data?.priceValid ? '价格有效' : '价格变更' }}
          </span>
        </div>
        <div v-if="data.data?.newPrice">
          <span class="text-gray-600">最新价格:</span>
          <span class="font-medium ml-2">{{ data.data.newPrice }}</span>
        </div>
      </div>
    </div>

    <!-- 行李查询结果 -->
    <div v-else-if="operation === 'baggageQuery'" class="space-y-3">
      <div v-if="data.data?.baggageInfo?.length">
        <h4 class="font-medium text-gray-900 mb-2">行李政策</h4>
        <div class="space-y-2">
          <div 
            v-for="(baggage, index) in data.data.baggageInfo" 
            :key="index"
            class="bg-gray-50 p-3 rounded border"
          >
            <div class="text-sm">
              <span class="font-medium">{{ baggage.segment }}:</span>
              <span class="ml-2">{{ baggage.allowance }}</span>
            </div>
            <div v-if="baggage.fee" class="text-xs text-gray-600 mt-1">
              额外费用: {{ baggage.fee }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 座位图结果 -->
    <div v-else-if="operation === 'seatMap'" class="space-y-3">
      <div v-if="data.data?.seatMap">
        <h4 class="font-medium text-gray-900 mb-2">座位图</h4>
        <div class="bg-gray-50 p-3 rounded border">
          <p class="text-sm text-gray-600">
            可用座位: {{ data.data.seatMap.availableSeats || 0 }}
          </p>
          <!-- 这里可以添加更复杂的座位图渲染 -->
        </div>
      </div>
    </div>

    <!-- 订单创建结果 -->
    <div v-else-if="operation === 'createOrder'" class="space-y-3">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div v-if="data.data?.orderId">
          <span class="text-gray-600">订单号:</span>
          <span class="font-medium ml-2 font-mono">{{ data.data.orderId }}</span>
        </div>
        <div v-if="data.data?.pnr">
          <span class="text-gray-600">PNR:</span>
          <span class="font-medium ml-2 font-mono">{{ data.data.pnr }}</span>
        </div>
        <div v-if="data.data?.totalPrice">
          <span class="text-gray-600">总价:</span>
          <span class="font-medium ml-2">{{ data.data.totalPrice }}</span>
        </div>
        <div v-if="data.data?.status">
          <span class="text-gray-600">状态:</span>
          <span class="font-medium ml-2">{{ data.data.status }}</span>
        </div>
      </div>
    </div>

    <!-- 支付验证结果 -->
    <div v-else-if="operation === 'paymentVerify'" class="space-y-3">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-600">支付状态:</span>
          <span :class="[
            'font-medium ml-2',
            data.data?.paymentStatus === 'success' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ data.data?.paymentStatus === 'success' ? '支付成功' : '支付失败' }}
          </span>
        </div>
        <div v-if="data.data?.transactionId">
          <span class="text-gray-600">交易号:</span>
          <span class="font-medium ml-2 font-mono">{{ data.data.transactionId }}</span>
        </div>
      </div>
    </div>

    <!-- 出票结果 -->
    <div v-else-if="operation === 'issueTicket'" class="space-y-3">
      <div v-if="data.data?.tickets?.length">
        <h4 class="font-medium text-gray-900 mb-2">机票信息</h4>
        <div class="space-y-2">
          <div 
            v-for="(ticket, index) in data.data.tickets" 
            :key="index"
            class="bg-gray-50 p-3 rounded border"
          >
            <div class="text-sm">
              <span class="font-medium">乘客:</span>
              <span class="ml-2">{{ ticket.passengerName }}</span>
            </div>
            <div class="text-sm mt-1">
              <span class="font-medium">票号:</span>
              <span class="ml-2 font-mono">{{ ticket.ticketNumber }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 获取票号结果 -->
    <div v-else-if="operation === 'getTicketNumber'" class="space-y-3">
      <div v-if="data.data?.ticketNumbers?.length">
        <h4 class="font-medium text-gray-900 mb-2">票号列表</h4>
        <div class="space-y-1">
          <div 
            v-for="(ticketNum, index) in data.data.ticketNumbers" 
            :key="index"
            class="bg-gray-50 p-2 rounded border font-mono text-sm"
          >
            {{ ticketNum }}
          </div>
        </div>
      </div>
    </div>

    <!-- 默认展示 -->
    <div v-else class="space-y-3">
      <div v-if="data.message" class="text-sm">
        <span class="text-gray-600">消息:</span>
        <span class="ml-2">{{ data.message }}</span>
      </div>
      <div v-if="data.data" class="text-sm">
        <span class="text-gray-600">响应数据:</span>
        <div class="mt-2 bg-gray-50 p-3 rounded border">
          <pre class="text-xs overflow-auto">{{ JSON.stringify(data.data, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- 通用错误信息 -->
    <div v-if="!data.success && data.message" class="bg-red-50 border border-red-200 p-3 rounded">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-red-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h4 class="text-red-800 font-medium">执行失败</h4>
          <p class="text-red-700 text-sm mt-1">{{ data.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  data: any
  operation: string
}

defineProps<Props>()

// 统计含有退改规则的航线数量
const getRoutesWithRulesCount = (routes: any[]) => {
  if (!routes) return 0
  return routes.filter(route => 
    (route.refunds && route.refunds.length > 0) || 
    (route.changes && route.changes.length > 0) ||
    (route.rule?.refunds && route.rule.refunds.length > 0) ||
    (route.rule?.changes && route.rule.changes.length > 0)
  ).length
}

// 计算平均规则数量
const getAverageRulesCount = (routes: any[]) => {
  if (!routes || routes.length === 0) return '0'
  
  const totalRules = routes.reduce((total, route) => {
    const refundsCount = (route.refunds?.length || 0) + (route.rule?.refunds?.length || 0)
    const changesCount = (route.changes?.length || 0) + (route.rule?.changes?.length || 0)
    return total + refundsCount + changesCount
  }, 0)
  
  const average = totalRules / routes.length
  return average.toFixed(1)
}

// 格式化函数
const getRouteTitle = (route: any) => {
  if (!route.fromSegments?.length) return '未知航线'
  const first = route.fromSegments[0]
  const last = route.fromSegments[route.fromSegments.length - 1]
  return `${first.depCity} → ${last.arrCity}`
}

const formatPrice = (route: any) => {
  if (route.totalPrice && route.currency) {
    return `${route.currency} ${route.totalPrice}`
  }
  return '价格待确认'
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
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
    'T': 'text-red-600 bg-red-50 px-1 py-0.5 rounded text-xs',
    'H': 'text-yellow-600 bg-yellow-50 px-1 py-0.5 rounded text-xs',
    'F': 'text-green-600 bg-green-50 px-1 py-0.5 rounded text-xs',
    'E': 'text-gray-600 bg-gray-50 px-1 py-0.5 rounded text-xs'
  }
  return classMap[status] || 'text-gray-600 bg-gray-50 px-1 py-0.5 rounded text-xs'
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
    'T': 'text-red-600 bg-red-50 px-1 py-0.5 rounded text-xs',
    'H': 'text-yellow-600 bg-yellow-50 px-1 py-0.5 rounded text-xs',
    'F': 'text-green-600 bg-green-50 px-1 py-0.5 rounded text-xs',
    'E': 'text-gray-600 bg-gray-50 px-1 py-0.5 rounded text-xs'
  }
  return classMap[status] || 'text-gray-600 bg-gray-50 px-1 py-0.5 rounded text-xs'
}
</script>

<style scoped>
/* 添加一些自定义样式 */
</style>
