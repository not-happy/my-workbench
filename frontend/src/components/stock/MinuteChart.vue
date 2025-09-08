<template>
  <div class="minute-chart h-full w-full">
    <div class="flex justify-between items-center mb-2 px-1">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
        分时走势
      </h3>
      <div class="text-xs text-gray-500 dark:text-gray-400">
        {{ lastClose ? `昨收: ${lastClose.toFixed(2)}` : '' }}
      </div>
    </div>
    
    <!-- 图表容器 -->
    <div 
      ref="chartContainer" 
      class="w-full h-full min-h-[200px]"
      style="height: calc(100% - 2rem);"
    ></div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
      <div class="text-sm text-gray-500 dark:text-gray-400">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { XueqiuMinuteData } from '../../services/xueqiuApiService'

interface Props {
  minuteData: XueqiuMinuteData | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const chartContainer = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
const lastClose = ref<number | null>(null)

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return

  chartInstance = echarts.init(chartContainer.value)
  
  const option = {
    grid: [
      {
        left: '3%',
        right: '3%',
        top: '5%',
        height: '60%'
      },
      {
        left: '3%',
        right: '3%',
        top: '70%',
        height: '25%'
      }
    ],
    xAxis: [
      {
        type: 'category',
        data: [],
        axisLine: { lineStyle: { color: '#8392A5' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#8392A5',
          fontSize: 10,
          formatter: (value: string) => {
            const time = new Date(parseInt(value))
            return time.getHours().toString().padStart(2, '0') + ':' + 
                   time.getMinutes().toString().padStart(2, '0')
          }
        },
        gridIndex: 0
      },
      {
        type: 'category',
        data: [],
        axisLine: { lineStyle: { color: '#8392A5' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#8392A5',
          fontSize: 10,
          formatter: (value: string) => {
            const time = new Date(parseInt(value))
            return time.getHours().toString().padStart(2, '0') + ':' + 
                   time.getMinutes().toString().padStart(2, '0')
          }
        },
        gridIndex: 1
      }
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        position: 'right',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#8392A5',
          fontSize: 10,
          formatter: (value: number) => value.toFixed(2)
        },
        splitLine: {
          lineStyle: { color: 'rgba(131, 146, 165, 0.1)' }
        },
        gridIndex: 0
      },
      {
        type: 'value',
        scale: true,
        position: 'right',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#8392A5',
          fontSize: 10,
          formatter: (value: number) => {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M'
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + 'K'
            }
            return value.toString()
          }
        },
        splitLine: {
          lineStyle: { color: 'rgba(131, 146, 165, 0.1)' }
        },
        gridIndex: 1
      }
    ],
    series: [
      {
        name: '价格',
        type: 'line',
        data: [],
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 1,
          color: '#1890ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
            ]
          }
        },
        xAxisIndex: 0,
        yAxisIndex: 0
      },
      {
        name: '成交量',
        type: 'bar',
        data: [],
        itemStyle: {
          color: (params: any) => {
            const item = props.minuteData?.items[params.dataIndex]
            if (!item) return '#1890ff'
            return item.chg >= 0 ? '#f04864' : '#2fc25b'
          }
        },
        xAxisIndex: 1,
        yAxisIndex: 1
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        if (!params || params.length === 0) return ''
        
        const dataIndex = params[0].dataIndex
        const item = props.minuteData?.items[dataIndex]
        if (!item) return ''

        const time = new Date(item.timestamp)
        const timeStr = time.getHours().toString().padStart(2, '0') + ':' + 
                       time.getMinutes().toString().padStart(2, '0')
        
        return `
          <div class="text-xs">
            <div class="font-medium">${timeStr}</div>
            <div class="mt-1">
              <div>价格: ${item.current.toFixed(2)}</div>
              <div>涨跌: ${item.chg >= 0 ? '+' : ''}${item.chg.toFixed(2)} (${item.percent.toFixed(2)}%)</div>
              <div>成交量: ${formatVolume(item.volume)}</div>
              <div>成交额: ${formatAmount(item.amount)}</div>
            </div>
          </div>
        `
      }
    },
    animation: false
  }

  chartInstance.setOption(option)
}

// 格式化成交量
const formatVolume = (volume: number): string => {
  if (volume >= 100000000) {
    return (volume / 100000000).toFixed(1) + '亿'
  } else if (volume >= 10000) {
    return (volume / 10000).toFixed(1) + '万'
  }
  return volume.toString()
}

// 格式化成交额
const formatAmount = (amount: number): string => {
  if (amount >= 100000000) {
    return (amount / 100000000).toFixed(1) + '亿'
  } else if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toString()
}

// 更新图表数据
const updateChart = () => {
  if (!chartInstance || !props.minuteData) return

  const items = props.minuteData.items.filter(item => item.volume > 0) // 过滤掉无效数据
  lastClose.value = props.minuteData.last_close

  const times = items.map(item => item.timestamp.toString())
  const prices = items.map(item => item.current)
  const volumes = items.map(item => item.volume)

  chartInstance.setOption({
    xAxis: [
      { data: times },
      { data: times }
    ],
    series: [
      { data: prices },
      { data: volumes }
    ]
  })
}

// 监听数据变化
watch(() => props.minuteData, () => {
  updateChart()
}, { deep: true })

// 监听加载状态
watch(() => props.loading, (loading) => {
  if (!loading) {
    nextTick(() => {
      updateChart()
    })
  }
})

// 窗口大小变化时重置图表
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
    updateChart()
  })
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.minute-chart {
  position: relative;
}
</style>
