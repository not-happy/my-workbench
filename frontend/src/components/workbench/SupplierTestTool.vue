<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- 工具头部 -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <button
            @click="$emit('close')"
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">供应商对接测试</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">全流程机票供应商API测试工具</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="createNewSession"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            新建测试会话
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧：操作流程和步骤 -->
      <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors duration-200">
        <!-- 测试步骤流程 -->
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">测试流程</h2>
          <div class="space-y-2">
            <div
              v-for="(step, index) in testSteps"
              :key="step.type"
              @click="selectStep(index)"
              :class="[
                'p-3 rounded-lg cursor-pointer transition-colors border',
                currentStepIndex === index
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
                getStepStatusClass(step.status)
              ]"
            >
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0">
                  <div
                    :class="[
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      getStepStatusClass(step.status, true)
                    ]"
                  >
                    <span v-if="step.status === 'loading'">
                      <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span v-else-if="step.status === 'success'">✓</span>
                    <span v-else-if="step.status === 'error'">✗</span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm">{{ step.name }}</div>
                  <div v-if="step.error" class="text-xs text-red-600 truncate">{{ step.error }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 当前选中的航线信息 -->
        <div v-if="selectedRoute" class="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-3">已选航线</h3>
          <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 text-sm transition-colors duration-200">
            <div class="font-medium text-gray-900 dark:text-white">{{ formatFlightInfo(selectedRoute) }}</div>
            <div class="text-gray-600 dark:text-gray-400 mt-1">{{ formatPrice(selectedRoute) }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧：主要操作区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 操作区域头部标签 -->
        <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ currentStep?.name || '选择测试步骤' }}
            </h2>
            <div class="flex gap-2">
              <button
                @click="showPayloadEditor = !showPayloadEditor"
                :class="[
                  'px-3 py-1 rounded text-sm transition-colors duration-200',
                  showPayloadEditor
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                ]"
              >
                {{ showPayloadEditor ? '表单模式' : 'JSON模式' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 操作内容区域 -->
        <div class="flex-1 flex overflow-hidden">
          <!-- 输入区域 -->
          <div class="w-1/2 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">请求配置</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
              <!-- 搜索表单 -->
              <FlightSearchForm
                v-if="currentStep?.type === 'search' && !showPayloadEditor"
                :model-value="searchForm"
                @update:model-value="updateSearchForm"
                @submit="executeSearch"
                :loading="currentStep.status === 'loading'"
              />
              
              <!-- JSON Payload 编辑器 -->
              <PayloadEditor
                v-else-if="showPayloadEditor || currentStep?.type !== 'search'"
                :model-value="currentStep?.requestPayload ? JSON.stringify(currentStep.requestPayload, null, 2) : '{}'"
                @update:model-value="updateRequestPayload"
                placeholder="输入请求 JSON payload..."
                :operation="currentStep?.type"
              />
              
              <!-- 操作按钮 -->
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <button
                  @click="executeCurrentStep"
                  :disabled="!canExecuteStep"
                  :class="[
                    'w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200',
                    canExecuteStep
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <span v-if="currentStep?.status === 'loading'" class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    执行中...
                  </span>
                  <span v-else>执行 {{ currentStep?.name }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 结果区域 -->
          <div class="w-1/2 flex flex-col">
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-200">
              <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">响应结果</h3>
              <div class="flex gap-2">
                <button
                  @click="togglePayloadEditor"
                  :class="[
                    'text-xs px-2 py-1 rounded transition-colors duration-200',
                    showPayloadEditor 
                      ? 'bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  ]"
                >
                  {{ getResponseButtonText() }}
                </button>
                <button
                  v-if="currentStep?.responsePayload"
                  @click="copyResponseToClipboard"
                  class="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300 transition-colors duration-200"
                >
                  复制JSON
                </button>
                <button
                  v-if="showPayloadEditor"
                  @click="clearResponse"
                  class="text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-2 py-1 rounded transition-colors duration-200"
                >
                  清空
                </button>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4">
              <!-- Payload 编辑器 -->
              <PayloadEditor
                v-if="showPayloadEditor"
                :operation="currentStep.type"
                v-model="editableResponse"
                @update:modelValue="updateResponse"
                placeholder="在此编辑或粘贴响应数据..."
              />
              
              <!-- 搜索结果展示 -->
              <FlightResults
                v-else-if="currentStep?.type === 'search' && currentStep?.responsePayload && !showPayloadEditor"
                :routes="currentStep.responsePayload.data?.routes || []"
                :selected-route="selectedRoute"
                @select-route="selectRoute"
                @action="handleRouteAction"
              />
              
              <!-- 格式化的JSON响应展示 -->
              <div v-else-if="currentStep?.responsePayload && !showPayloadEditor" class="space-y-4">
                <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
                  <!-- 响应头信息 -->
                  <div class="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
                    <div class="flex items-center justify-between text-sm">
                      <span class="font-medium text-gray-700 dark:text-gray-300">响应概览</span>
                      <span :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        currentStep.responsePayload.success 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      ]">
                        {{ currentStep.responsePayload.success ? '成功' : '失败' }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- 响应数据渲染 -->
                  <div class="p-4">
                    <ResponseRenderer 
                      :data="currentStep.responsePayload" 
                      :operation="currentStep.type"
                    />
                  </div>
                </div>
                
                <!-- 原始JSON数据（可折叠） -->
                <details class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200">
                  <summary class="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    查看原始JSON数据
                  </summary>
                  <div class="px-4 pb-4">
                    <pre class="bg-gray-900 dark:bg-gray-950 text-green-400 dark:text-green-300 p-4 rounded text-xs overflow-auto max-h-96">{{ JSON.stringify(currentStep.responsePayload, null, 2) }}</pre>
                  </div>
                </details>
              </div>
              
              <!-- 错误信息 -->
              <div v-else-if="currentStep?.error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg transition-colors duration-200">
                <div class="text-red-800 dark:text-red-400 font-medium">执行失败</div>
                <div class="text-red-600 dark:text-red-400 text-sm mt-1">{{ currentStep.error }}</div>
              </div>
              
              <!-- 空状态 -->
              <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
                <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <p>执行操作后，结果将在这里显示</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '../../services/apiService'
import type { 
  TestSession, 
  OperationStep, 
  FlightRoute, 
  FlightSearchRequest, 
  TestOperation 
} from '../../../../shared/supplier-types'
import FlightSearchForm from '../supplier/FlightSearchForm.vue'
import FlightResults from '../supplier/FlightResults.vue'
import PayloadEditor from '../supplier/PayloadEditor.vue'
import ResponseRenderer from '../supplier/ResponseRenderer.vue'

interface Emits {
  (e: 'close'): void
}

defineEmits<Emits>()

// 测试会话状态
const currentSession = ref<TestSession | null>(null)
const currentStepIndex = ref(0)
const selectedRoute = ref<FlightRoute | null>(null)
const showPayloadEditor = ref(false)
const editableResponse = ref('')

// 搜索表单数据
const searchForm = ref<FlightSearchRequest>({
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
})

// 测试步骤定义
const defaultSteps: OperationStep[] = [
  { type: 'search', name: '搜索航班', status: 'pending' },
  { type: 'priceVerify', name: '验价', status: 'pending' },
  { type: 'baggageQuery', name: '查询行李', status: 'pending' },
  { type: 'seatMap', name: '查询选座', status: 'pending' },
  { type: 'createOrder', name: '生单', status: 'pending' },
  { type: 'paymentVerify', name: '支付校验', status: 'pending' },
  { type: 'issueTicket', name: '出票', status: 'pending' },
  { type: 'getTicketNumber', name: '获取票号', status: 'pending' }
]

// 计算属性
const testSteps = computed(() => currentSession.value?.steps || defaultSteps)
const currentStep = computed(() => testSteps.value[currentStepIndex.value])
const canExecuteStep = computed(() => {
  if (!currentStep.value) return false
  if (currentStep.value.status === 'loading') return false
  if (currentStep.value.type === 'search') return true
  return selectedRoute.value !== null
})

// 方法
const createNewSession = () => {
  currentSession.value = {
    id: Date.now().toString(),
    name: `测试会话 ${new Date().toLocaleString()}`,
    steps: JSON.parse(JSON.stringify(defaultSteps)),
    currentStep: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  currentStepIndex.value = 0
  selectedRoute.value = null
}

const selectStep = (index: number) => {
  currentStepIndex.value = index
}

const updateSearchForm = (form: FlightSearchRequest) => {
  searchForm.value = form
  if (currentStep.value) {
    currentStep.value.requestPayload = form
  }
}

const updateRequestPayload = (payload: string) => {
  if (currentStep.value) {
    try {
      currentStep.value.requestPayload = JSON.parse(payload)
    } catch (e) {
      currentStep.value.requestPayload = payload
    }
  }
}

const executeCurrentStep = async () => {
  if (!currentStep.value || !canExecuteStep.value) return
  
  if (currentStep.value.type === 'search') {
    await executeSearch()
  } else {
    await executeOperation(currentStep.value.type)
  }
}

const executeSearch = async () => {
  const step = currentStep.value
  if (!step) return

  step.status = 'loading'
  step.error = undefined

  try {
    const response = await apiService.supplier.searchFlights(searchForm.value)
    step.responsePayload = response.data.data
    step.status = 'success'
  } catch (error) {
    step.status = 'error'
    step.error = error instanceof Error ? error.message : '搜索失败'
  }
}

const executeOperation = async (operation: TestOperation) => {
  const step = currentStep.value
  if (!step || !selectedRoute.value) return

  step.status = 'loading'
  step.error = undefined

  try {
    let response: any
    
    switch (operation) {
      case 'priceVerify':
        response = await apiService.supplier.verifyPrice({
          routeData: selectedRoute.value.data
        })
        break
      case 'baggageQuery':
        response = await apiService.supplier.queryBaggage({
          routeData: selectedRoute.value.data
        })
        break
      case 'seatMap':
        response = await apiService.supplier.querySeatMap({
          routeData: selectedRoute.value.data
        })
        break
      case 'createOrder':
        response = await apiService.supplier.createOrder(
          step.requestPayload || {
            routeData: selectedRoute.value.data,
            passengers: [],
            contactInfo: { email: '', phone: '', countryCode: '' }
          }
        )
        break
      case 'paymentVerify':
        response = await apiService.supplier.verifyPayment(
          step.requestPayload || { orderId: '' }
        )
        break
      case 'issueTicket':
        response = await apiService.supplier.issueTicket(
          step.requestPayload || { orderId: '', pnr: '' }
        )
        break
      case 'getTicketNumber':
        response = await apiService.supplier.getTicketNumbers(
          step.requestPayload || { orderId: '', pnr: '' }
        )
        break
      default:
        throw new Error(`不支持的操作: ${operation}`)
    }
    
    step.responsePayload = response.data.data
    step.status = 'success'
  } catch (error) {
    step.status = 'error'
    step.error = error instanceof Error ? error.message : '执行失败'
  }
}

const selectRoute = (route: FlightRoute) => {
  selectedRoute.value = route
}

const handleRouteAction = (action: string, route: FlightRoute) => {
  selectedRoute.value = route
  
  const actionStepMap: Record<string, number> = {
    'priceVerify': 1,
    'baggageQuery': 2,
    'seatMap': 3,
    'createOrder': 4
  }
  
  if (actionStepMap[action] !== undefined) {
    currentStepIndex.value = actionStepMap[action]
  }
}

const getStepStatusClass = (status: string, isIcon = false) => {
  if (isIcon) {
    switch (status) {
      case 'success': return 'bg-green-500 text-white'
      case 'error': return 'bg-red-500 text-white'
      case 'loading': return 'bg-blue-500 text-white'
      default: return 'bg-gray-300 text-gray-600'
    }
  } else {
    switch (status) {
      case 'success': return 'border-green-300 bg-green-50 text-green-700'
      case 'error': return 'border-red-300 bg-red-50 text-red-700'
      case 'loading': return 'border-blue-300 bg-blue-50 text-blue-700'
      default: return ''
    }
  }
}

const formatFlightInfo = (route: FlightRoute) => {
  if (!route.fromSegments?.length) return ''
  const first = route.fromSegments[0]
  const last = route.fromSegments[route.fromSegments.length - 1]
  return `${first.depCity} → ${last.arrCity}`
}

const formatPrice = (_route: FlightRoute) => {
  return '价格待确认'
}

// 响应数据编辑功能
const getResponseButtonText = () => {
  if (showPayloadEditor.value) {
    return currentStep.value?.responsePayload ? '查看结果' : '取消添加'
  } else {
    return currentStep.value?.responsePayload ? '编辑响应' : '添加响应数据'
  }
}

const togglePayloadEditor = () => {
  showPayloadEditor.value = !showPayloadEditor.value
  if (showPayloadEditor.value) {
    if (currentStep.value?.responsePayload) {
      editableResponse.value = JSON.stringify(currentStep.value.responsePayload, null, 2)
    } else {
      // 根据步骤类型提供对应的响应模板
      editableResponse.value = JSON.stringify(getResponseTemplate(currentStep.value?.type), null, 2)
    }
  }
}

const clearResponse = () => {
  editableResponse.value = JSON.stringify(getResponseTemplate(currentStep.value?.type), null, 2)
}

// 根据操作类型获取响应模板
const getResponseTemplate = (operationType?: string) => {
  const baseTemplate = {
    success: true,
    message: "操作成功",
    data: {}
  }

  switch (operationType) {
    case 'search':
      return {
        ...baseTemplate,
        searchTime: 1200,
        message: "搜索成功",
        data: {
          routes: [
            {
              baggage: [{ adultPieces: "1PC", adultWeights: "30KG", segmentNo: 1 }],
              cabinBaggage: [{ adultQuantity: "1PC", adultWeight: "10KG", segmentNo: 1 }],
              data: "route_data_string",
              ds: "SABRE",
              fareBasis: "B2TR24#W2TR24",
              fareType: "public#public",
              flightClass: "Economy",
              fromSegments: [{
                aircraftCode: "32Q",
                arrAirport: "SIN",
                arrCity: "SIN",
                arrTime: "2025-10-26 10:25:00",
                cabin: "B",
                cabinGrade: "Y",
                carrier: "TR",
                codeShare: false,
                depAirport: "MNL",
                depCity: "MNL",
                depTime: "2025-10-26 06:30:00",
                eTicket: true,
                flightNumber: "TR397",
                flightTime: "235",
                fromTerminal: "3",
                marketingCarrier: "TR",
                marriageGrp: "O",
                operatingCarrier: "TR",
                operatingFlightNumber: "TR397",
                seatsRemain: "2",
                segmentType: 1,
                stopQuantity: 0,
                toTerminal: "1"
              }],
              fromTo: "MNL-SIN",
              itineraryId: "1",
              pcc: "G5NJ",
              prices: [{
                baseFare: 309.00,
                currency: "CAD",
                passengerType: "ADT",
                tax: 59.24,
                taxYq: 0,
                taxYr: 32.98
              }],
              routeCodes: {
                airports: "MNL-SIN",
                cabins: "B",
                carriers: "TR",
                flightNumbers: "TR397",
                flightTimes: "2025-10-26 06:30:00/2025-10-26 10:25:00",
                marketingCarriers: "TR",
                operatingCarriers: "TR"
              },
              rule: {
                changes: [{
                  changeFee: 245.00,
                  changeStatus: "H",
                  changeType: 0,
                  currency: "CAD"
                }],
                refunds: [{
                  refundStatus: "T",
                  refundType: 0
                }]
              },
              tripType: "1",
              validatingCarrier: "SQ"
            }
          ]
        }
      }

    case 'priceVerify':
      return {
        ...baseTemplate,
        message: "验价成功",
        data: {
          priceValid: true,
          newPrice: 1580,
          currency: "CNY",
          priceBreakdown: {
            basePrice: 1380,
            taxes: 200
          }
        }
      }

    case 'baggageQuery':
      return {
        ...baseTemplate,
        message: "行李查询成功",
        data: {
          baggageInfo: [{
            segmentNo: 1,
            freeBaggage: "23KG",
            paidBaggage: [{
              weight: "32KG",
              price: 200,
              currency: "CNY"
            }]
          }]
        }
      }

    case 'seatMap':
      return {
        ...baseTemplate,
        message: "选座查询成功",
        data: {
          seatMap: {
            aircraft: "320",
            rows: 30,
            seatsPerRow: 6,
            availableSeats: ["1A", "1B", "2C", "3D"]
          }
        }
      }

    case 'createOrder':
      return {
        ...baseTemplate,
        message: "生单成功",
        data: {
          orderId: "ORD20240915001",
          status: "PENDING",
          totalPrice: 1580,
          currency: "CNY"
        }
      }

    default:
      return baseTemplate
  }
}

const copyResponseToClipboard = async () => {
  if (currentStep.value?.responsePayload) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentStep.value.responsePayload, null, 2))
      // 这里可以添加成功提示
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}

const updateResponse = (newValue: string) => {
  editableResponse.value = newValue
  try {
    const parsed = JSON.parse(newValue)
    if (currentStep.value) {
      currentStep.value.responsePayload = parsed
    }
  } catch (error) {
    console.error('JSON解析失败:', error)
  }
}

// 初始化
onMounted(() => {
  createNewSession()
})
</script>

<style scoped>
</style>
