<template>
  <div class="stock-monitor-tool h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- 股票搜索和添加区域 -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-3 flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="flex-1 max-w-md">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="addStock"
              type="text"
              placeholder="输入股票代码 (如: SH600246)"
              class="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
        <button
          @click="addStock"
          :disabled="!searchQuery.trim()"
          class="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-md font-medium"
        >
          添加
        </button>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <div 
            class="w-2 h-2 rounded-full"
            :class="marketStatus.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
          ></div>
          <span>{{ marketStatus.marketMessage }}</span>
          <span>{{ apiStatus }}</span>
        </div>
      </div>
    </div>

    <!-- 主要监控面板 - 左右分栏 -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full grid grid-cols-12 gap-4 p-4">
        <!-- 左侧：自选股列表 -->
        <div class="col-span-4 space-y-4 overflow-y-auto">
          <!-- 自选股标题 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">自选股</h3>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ watchlist.length }} 只</span>
            </div>
            
            <!-- 股票列表 -->
            <div class="space-y-2">
              <div 
                v-for="stock in watchlist" 
                :key="stock.code"
                @click="selectStock(stock)"
                :class="[
                  'p-3 rounded-lg border-2 cursor-pointer transition-all duration-200',
                  selectedStock?.code === stock.code 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-gray-900 dark:text-white text-sm truncate">{{ stock.name }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ stock.code }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-xl font-bold tabular-nums" :class="stock.change >= 0 ? 'text-red-600' : 'text-green-600'">
                        ¥{{ stock.price.toFixed(2) }}
                      </span>
                      <span 
                        class="text-sm font-medium tabular-nums"
                        :class="stock.change >= 0 ? 'text-red-600' : 'text-green-600'"
                      >
                        {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}
                      </span>
                      <span 
                        class="text-sm font-medium tabular-nums"
                        :class="stock.changePercent >= 0 ? 'text-red-600' : 'text-green-600'"
                      >
                        {{ stock.changePercent >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%
                      </span>
                    </div>
                    <div class="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>量: {{ formatVolumeShort(stock.volume) }}</span>
                      <span>额: {{ formatAmountShort(stock.amount) }}</span>
                    </div>
                  </div>
                  <button 
                    @click.stop="removeStock(stock.code)"
                    class="ml-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 添加股票提示 -->
            <div v-if="watchlist.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <p class="text-gray-500 dark:text-gray-400 text-sm">暂无自选股</p>
              <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">在上方搜索栏添加股票代码</p>
            </div>
          </div>
        </div>

        <!-- 右侧：股票详情和图表 -->
        <div class="col-span-8 overflow-y-auto">
          <!-- 股票详情卡片 -->
          <div v-if="selectedStock" class="space-y-4">
            <!-- 股票基本信息 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <!-- 标题和操作 -->
              <div class="flex items-center justify-between mb-4">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedStock.name }}</h2>
                    <span class="text-lg text-gray-500 dark:text-gray-400 font-mono">{{ selectedStock.code }}</span>
                    <span class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded font-medium">
                      沪深通 可融资 可卖空
                    </span>
                  </div>
                  <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    + 加自选
                  </button>
                </div>
              </div>

              <!-- 价格信息 -->
              <div class="grid grid-cols-12 gap-4 mb-4">
                <!-- 主价格区域 -->
                <div class="col-span-4">
                  <div class="text-4xl font-bold tabular-nums mb-2" :class="selectedStock.change >= 0 ? 'text-red-600' : 'text-green-600'">
                    ¥{{ selectedStock.price.toFixed(2) }}
                  </div>
                  <div class="flex items-center gap-2">
                    <span 
                      class="text-lg font-medium tabular-nums"
                      :class="selectedStock.change >= 0 ? 'text-red-600' : 'text-green-600'"
                    >
                      {{ selectedStock.change >= 0 ? '+' : '' }}{{ selectedStock.change.toFixed(2) }}
                    </span>
                    <span 
                      class="text-lg font-medium tabular-nums"
                      :class="selectedStock.changePercent >= 0 ? 'text-red-600' : 'text-green-600'"
                    >
                      {{ selectedStock.changePercent >= 0 ? '+' : '' }}{{ selectedStock.changePercent.toFixed(2) }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    休盘中 09-08 {{ lastUpdateTime.toLocaleTimeString('zh-CN', { hour12: false }) }} 北京时间
                  </div>
                </div>

                <!-- 关键指标网格 - 紧凑布局 -->
                <div class="col-span-8 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400">今开:</span>
                    <span class="font-medium text-gray-900 dark:text-white ml-1 tabular-nums">{{ selectedStock.open.toFixed(2) }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400">最高:</span>
                    <span class="font-medium text-red-600 ml-1 tabular-nums">{{ selectedStock.high.toFixed(2) }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400">最低:</span>
                    <span class="font-medium text-green-600 ml-1 tabular-nums">{{ selectedStock.low.toFixed(2) }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400">换手:</span>
                    <span class="font-medium text-gray-900 dark:text-white ml-1 tabular-nums">{{ selectedStock.turnover.toFixed(2) }}%</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400">量:</span>
                    <span class="font-medium text-gray-900 dark:text-white ml-1 tabular-nums">{{ formatVolumeShort(selectedStock.volume) }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400">额:</span>
                    <span class="font-medium text-gray-900 dark:text-white ml-1 tabular-nums">{{ formatAmountShort(selectedStock.amount) }}</span>
                  </div>
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400">流通:</span>
                    <span class="font-medium text-gray-900 dark:text-white ml-1 tabular-nums">{{ formatAmountShort((selectedStock.marketCap || 0) * 0.8) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 分时走势图区域 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <!-- 时间段选择器 -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-1">
                  <button 
                    v-for="period in ['分时', '五日', '日K', '周K', '月K']"
                    :key="period"
                    :class="[
                      'px-3 py-1 text-sm transition-colors duration-150 rounded',
                      selectedPeriod === period 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                    @click="selectedPeriod = period"
                  >
                    {{ period }}
                  </button>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <span>{{ selectedPeriod === '分时' ? '11:29' : '2025-09-08' }}</span>
                  <div class="flex items-center gap-1">
                    <span class="text-red-600">6.72%</span>
                    <span>五档盘口</span>
                  </div>
                </div>
              </div>
              
              <!-- 分时K线图 -->
              <div class="h-80 bg-gray-50 dark:bg-gray-700 rounded relative">
                <MinuteChart 
                  :minute-data="minuteData" 
                  :loading="minuteLoading"
                  class="h-full w-full"
                />
                
                <!-- 图表标签 -->
                <div class="absolute top-4 left-4 text-sm">
                  <div class="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <span>最新 {{ selectedStock?.price.toFixed(2) }}</span>
                    <span :class="(selectedStock?.change ?? 0) >= 0 ? 'text-red-600' : 'text-green-600'">
                      {{ (selectedStock?.change ?? 0) >= 0 ? '+' : '' }}{{ selectedStock?.change.toFixed(2) }} ({{ (selectedStock?.changePercent ?? 0) >= 0 ? '+' : '' }}{{ selectedStock?.changePercent.toFixed(2) }}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 未选择股票时的提示 -->
          <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            <p class="text-xl text-gray-500 dark:text-gray-400 mb-2">请选择股票查看详情</p>
            <p class="text-sm text-gray-400 dark:text-gray-500">在左侧自选股列表中点击股票，或添加新的监控股票</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getMarketStatus, type StockData } from '../../services/stockService'
import { enhancedStockService, type XueqiuPankouData, type XueqiuMinuteData } from '../../services/xueqiuApiService'
import MinuteChart from './MinuteChart.vue'

// 股票数据接口 (扩展)
interface Stock extends StockData {
  amount?: number // 成交额
}

// 交易数据接口
interface TradeData {
  id: string
  timestamp: number
  price: number
  volume: number
  side: number // 1=买入, -1=卖出
}

// 响应式数据
const searchQuery = ref('')
const watchlist = ref<Stock[]>([])
const selectedStock = ref<Stock | null>(null)
const selectedPeriod = ref('分时')
const marketStatus = ref(getMarketStatus())
const lastUpdateTime = ref(new Date())
const autoRefreshTimer = ref<NodeJS.Timeout | null>(null)
const isLoading = ref(false)
const apiStatus = ref('检测中...') // API状态显示

// 实时交易数据存储
const realtimeTrades = ref<Map<string, TradeData[]>>(new Map())

// 盘口数据存储
const pankouData = ref<XueqiuPankouData | null>(null)

// 分时K线数据存储
const minuteData = ref<XueqiuMinuteData | null>(null)
const minuteLoading = ref(false)

// 本地存储键名
const STORAGE_KEY = 'stock-monitor-watchlist'

// 选择股票
const selectStock = (stock: Stock) => {
  selectedStock.value = stock
  loadPankouData(stock.code)
  loadMinuteData(stock.code)
}

// 获取盘口数据
const loadPankouData = async (stockCode: string) => {
  try {
    const data = await enhancedStockService.getPankouData(stockCode)
    pankouData.value = data
  } catch (error) {
    console.error('获取盘口数据失败:', error)
    pankouData.value = null
  }
}

// 获取分时K线数据
const loadMinuteData = async (stockCode: string) => {
  minuteLoading.value = true
  try {
    const data = await enhancedStockService.getMinuteData(stockCode, '1d')
    minuteData.value = data
  } catch (error) {
    console.error('获取分时数据失败:', error)
    minuteData.value = null
  } finally {
    minuteLoading.value = false
  }
}

// 添加股票到监控列表
const addStock = async () => {
  if (!searchQuery.value.trim()) return
  
  isLoading.value = true
  try {
    const query = searchQuery.value.trim().toUpperCase()
    
    // 如果输入的是股票代码，尝试直接获取股票信息
    const stockData = await enhancedStockService.getStock(query)
    
    if (stockData) {
      // 检查是否已经存在
      if (!watchlist.value.find(s => s.code === stockData.code)) {
        // 添加额外的属性
        const enhancedStock: Stock = {
          ...stockData,
          amount: stockData.volume * stockData.price // 计算成交额
        }
        
        watchlist.value.push(enhancedStock)
        saveWatchlistToStorage()
        
        // 生成模拟交易数据
        generateMockTrades(enhancedStock.code)
      }
    } else {
      console.log('未找到匹配的股票:', query)
    }
  } catch (error) {
    console.error('搜索股票失败:', error)
  } finally {
    isLoading.value = false
    searchQuery.value = ''
  }
}

// 添加推荐股票
const addDefaultStocks = async () => {
  const defaultCodes = ['SH600246', 'SH600519', 'SZ000858'] // 万通发展、贵州茅台、五粮液
  
  for (const code of defaultCodes) {
    try {
      const stockData = await enhancedStockService.getStock(code)
      if (stockData && !watchlist.value.find(s => s.code === stockData.code)) {
        const enhancedStock: Stock = {
          ...stockData,
          amount: stockData.volume * stockData.price
        }
        watchlist.value.push(enhancedStock)
        generateMockTrades(enhancedStock.code)
      }
    } catch (error) {
      console.error(`添加默认股票 ${code} 失败:`, error)
    }
  }
  
  saveWatchlistToStorage()
}

// 移除股票
const removeStock = (code: string) => {
  const index = watchlist.value.findIndex(stock => stock.code === code)
  if (index > -1) {
    watchlist.value.splice(index, 1)
    realtimeTrades.value.delete(code)
    saveWatchlistToStorage()
  }
}

// 生成模拟交易数据
const generateMockTrades = (code: string) => {
  const stock = watchlist.value.find(s => s.code === code)
  if (!stock) return
  
  const trades: TradeData[] = []
  const basePrice = stock.price
  const now = Date.now()
  
  // 生成10条模拟交易记录
  for (let i = 0; i < 10; i++) {
    const priceVariation = (Math.random() - 0.5) * 0.02 // ±1%的价格波动
    const side = Math.random() > 0.5 ? 1 : -1
    
    trades.push({
      id: `${code}_${now}_${i}`,
      timestamp: now - (i * 30000), // 每30秒一笔交易
      price: basePrice * (1 + priceVariation),
      volume: Math.floor(Math.random() * 10000) + 100,
      side: side
    })
  }
  
  realtimeTrades.value.set(code, trades)
}

// 获取股票的实时交易数据
const getRecentTrades = (code: string): TradeData[] => {
  return realtimeTrades.value.get(code) || []
}

// 刷新监控列表中的股票数据
const refreshWatchlist = async () => {
  if (watchlist.value.length === 0) return
  
  isLoading.value = true
  try {
    const codes = watchlist.value.map(stock => stock.code)
    const updatedStocks = await enhancedStockService.getStocks(codes)
    
    // 更新监控列表，保持额外属性
    if (updatedStocks.length > 0) {
      watchlist.value = updatedStocks.map(stock => ({
        ...stock,
        amount: stock.volume * stock.price
      }))
    }
    
    // 更新所有股票的交易数据
    codes.forEach(code => {
      generateMockTrades(code)
    })
    
    // 如果有选中股票，刷新盘口数据
    if (selectedStock.value) {
      await loadPankouData(selectedStock.value.code)
    }
    
    // 更新市场状态和时间
    marketStatus.value = getMarketStatus()
    lastUpdateTime.value = new Date()
    apiStatus.value = '数据已更新'
    
    setTimeout(() => {
      apiStatus.value = '正常运行'
    }, 2000)
  } catch (error) {
    console.error('刷新数据失败:', error)
    apiStatus.value = '更新失败'
  } finally {
    isLoading.value = false
  }
}

// 启动自动刷新
const startAutoRefresh = () => {
  autoRefreshTimer.value = setInterval(() => {
    refreshWatchlist()
  }, 10000) // 每10秒刷新一次
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshTimer.value) {
    clearInterval(autoRefreshTimer.value)
    autoRefreshTimer.value = null
  }
}

// 格式化成交量 - 简洁版
const formatVolumeShort = (volume: number): string => {
  if (volume >= 100000000) {
    return (volume / 100000000).toFixed(1) + '亿'
  } else if (volume >= 10000) {
    return (volume / 10000).toFixed(0) + '万'
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(1) + 'K'
  }
  return volume.toString()
}

// 格式化成交额 - 简洁版
const formatAmountShort = (amount: number | undefined): string => {
  if (!amount) return '0'
  if (amount >= 100000000) {
    return (amount / 100000000).toFixed(1) + '亿'
  } else if (amount >= 10000) {
    return (amount / 10000).toFixed(0) + '万'
  }
  return amount.toString()
}

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  })
}

// 获取盘口价格
const getPankouPrice = (pankou: XueqiuPankouData, type: string, level: number): string => {
  const key = `${type}${level}` as keyof XueqiuPankouData
  const price = pankou[key] as number
  return price ? price.toFixed(2) : '--'
}

// 获取盘口数量
const getPankouVolume = (pankou: XueqiuPankouData, type: string, level: number): number => {
  const key = `${type}${level}` as keyof XueqiuPankouData
  const volume = pankou[key] as number
  return volume || 0
}

// 保存监控列表到本地存储
const saveWatchlistToStorage = () => {
  try {
    const data = {
      watchlist: watchlist.value.map(stock => ({
        code: stock.code,
        name: stock.name
      })),
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

// 从本地存储加载监控列表
const loadWatchlistFromStorage = async () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      const savedCodes = parsed.watchlist?.map((item: any) => item.code) || []
      
      // 重新获取股票数据
      for (const code of savedCodes) {
        try {
          const stockData = await enhancedStockService.getStock(code)
          if (stockData) {
            const enhancedStock: Stock = {
              ...stockData,
              amount: stockData.volume * stockData.price
            }
            watchlist.value.push(enhancedStock)
            generateMockTrades(enhancedStock.code)
          }
        } catch (error) {
          console.error(`加载股票 ${code} 失败:`, error)
        }
      }
    }
  } catch (error) {
    console.error('从本地存储加载失败:', error)
  }
}

// 组件挂载时的初始化
onMounted(async () => {
  apiStatus.value = '初始化中...'
  
  try {
    // 从本地存储加载监控列表
    await loadWatchlistFromStorage()
    
    // 如果没有保存的数据，添加万通发展作为默认
    if (watchlist.value.length === 0) {
      await addDefaultStocks()
    }
    
    // 自动选择第一只股票并加载盘口数据
    if (watchlist.value.length > 0 && !selectedStock.value) {
      const firstStock = watchlist.value[0]
      selectedStock.value = firstStock
      await loadPankouData(firstStock.code)
    }
    
    // 启动自动刷新
    startAutoRefresh()
    
    // 立即刷新一次数据
    await refreshWatchlist()
  } catch (error) {
    console.error('初始化失败:', error)
    apiStatus.value = '初始化失败'
  }
})

// 组件卸载时清理
onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.stock-monitor-tool {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.8);
}

/* 暗色模式下的滚动条 */
.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(75, 85, 99, 0.8);
}
</style>