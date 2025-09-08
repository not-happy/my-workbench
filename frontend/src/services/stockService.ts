// 股票数据模拟服务
export interface StockData {
  code: string
  name: string
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  volume: number
  turnover: number
  rsi: number
  macd: number
  kdj: number
  marketCap?: number
  pe?: number
  pb?: number
}

export interface StockQuote {
  timestamp: number
  price: number
  volume: number
}

// 内置股票数据
const stockDatabase: Record<string, Omit<StockData, 'price' | 'change' | 'changePercent'>> = {
  '000001': {
    code: '000001',
    name: '平安银行',
    open: 10.73,
    high: 10.98,
    low: 10.68,
    volume: 125840000,
    turnover: 1.85,
    rsi: 65.2,
    macd: 0.025,
    kdj: 72.1,
    marketCap: 2105.8,
    pe: 6.2,
    pb: 0.8
  },
  '000002': {
    code: '000002',
    name: '万科A',
    open: 9.00,
    high: 9.05,
    low: 8.88,
    volume: 98760000,
    turnover: 2.12,
    rsi: 42.8,
    macd: -0.018,
    kdj: 38.9,
    marketCap: 1058.9,
    pe: 8.9,
    pb: 0.9
  },
  '600519': {
    code: '600519',
    name: '贵州茅台',
    open: 1680.00,
    high: 1695.50,
    low: 1672.80,
    volume: 1850000,
    turnover: 0.95,
    rsi: 58.3,
    macd: 0.012,
    kdj: 62.5,
    marketCap: 21058.7,
    pe: 28.5,
    pb: 12.8
  },
  '000858': {
    code: '000858',
    name: '五粮液',
    open: 128.50,
    high: 131.20,
    low: 127.80,
    volume: 12580000,
    turnover: 1.65,
    rsi: 55.7,
    macd: 0.008,
    kdj: 58.9,
    marketCap: 5128.9,
    pe: 18.2,
    pb: 4.5
  },
  '600036': {
    code: '600036',
    name: '招商银行',
    open: 32.50,
    high: 33.15,
    low: 32.28,
    volume: 45780000,
    turnover: 1.25,
    rsi: 61.2,
    macd: 0.015,
    kdj: 68.3,
    marketCap: 8956.7,
    pe: 7.8,
    pb: 1.2
  },
  '300750': {
    code: '300750',
    name: '宁德时代',
    open: 185.60,
    high: 189.80,
    low: 184.20,
    volume: 28960000,
    turnover: 2.85,
    rsi: 68.9,
    macd: 0.032,
    kdj: 75.6,
    marketCap: 8156.9,
    pe: 35.6,
    pb: 6.8
  }
}

class StockService {
  private quotes: Map<string, StockQuote[]> = new Map()
  private baseData: Map<string, StockData> = new Map()

  constructor() {
    this.initializeBaseData()
    this.startPriceSimulation()
  }

  // 初始化基础数据
  private initializeBaseData() {
    Object.values(stockDatabase).forEach(stock => {
      const currentPrice = stock.open + (Math.random() - 0.5) * 2
      const change = currentPrice - stock.open
      const changePercent = (change / stock.open) * 100

      const stockData: StockData = {
        ...stock,
        price: Number(currentPrice.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2))
      }

      this.baseData.set(stock.code, stockData)
    })
  }

  // 开始价格模拟
  private startPriceSimulation() {
    setInterval(() => {
      this.updateAllPrices()
    }, 3000) // 每3秒更新一次价格
  }

  // 更新所有股票价格
  private updateAllPrices() {
    this.baseData.forEach((_, code) => {
      this.updateStockPrice(code)
    })
  }

  // 更新单个股票价格
  private updateStockPrice(code: string) {
    const stock = this.baseData.get(code)
    if (!stock) return

    // 模拟价格波动 (-0.5% 到 +0.5%)
    const volatility = (Math.random() - 0.5) * 0.01
    const priceChange = stock.price * volatility
    const newPrice = Math.max(0.01, stock.price + priceChange)

    // 更新股票数据
    const change = newPrice - stock.open
    const changePercent = (change / stock.open) * 100

    stock.price = Number(newPrice.toFixed(2))
    stock.change = Number(change.toFixed(2))
    stock.changePercent = Number(changePercent.toFixed(2))

    // 记录报价历史
    const quote: StockQuote = {
      timestamp: Date.now(),
      price: stock.price,
      volume: stock.volume + Math.floor(Math.random() * 1000000)
    }

    if (!this.quotes.has(code)) {
      this.quotes.set(code, [])
    }

    const quotes = this.quotes.get(code)!
    quotes.push(quote)

    // 保持最近100个报价
    if (quotes.length > 100) {
      quotes.shift()
    }
  }

  // 搜索股票
  searchStock(query: string): StockData[] {
    const results: StockData[] = []
    
    this.baseData.forEach(stock => {
      if (stock.code.includes(query) || 
          stock.name.includes(query) ||
          stock.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({ ...stock })
      }
    })

    return results
  }

  // 获取股票数据
  getStock(code: string): StockData | null {
    const stock = this.baseData.get(code)
    return stock ? { ...stock } : null
  }

  // 获取股票报价历史
  getQuotes(code: string): StockQuote[] {
    return this.quotes.get(code)?.slice() || []
  }

  // 获取热门股票
  getHotStocks(limit: number = 6): StockData[] {
    const stocks = Array.from(this.baseData.values())
    return stocks
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, limit)
      .map(stock => ({ ...stock }))
  }

  // 批量获取股票数据
  getStocks(codes: string[]): StockData[] {
    return codes
      .map(code => this.getStock(code))
      .filter(stock => stock !== null) as StockData[]
  }

  // 添加自定义股票（用于测试）
  addCustomStock(stockData: Omit<StockData, 'price' | 'change' | 'changePercent'>) {
    const currentPrice = stockData.open + (Math.random() - 0.5) * 2
    const change = currentPrice - stockData.open
    const changePercent = (change / stockData.open) * 100

    const stock: StockData = {
      ...stockData,
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2))
    }

    this.baseData.set(stock.code, stock)
    return stock
  }
}

// 单例实例
export const stockService = new StockService()

// 市场状态接口
export interface MarketStatus {
  isOpen: boolean
  openTime: string
  closeTime: string
  currentTime: string
  marketMessage: string
}

// 获取市场状态
export const getMarketStatus = (): MarketStatus => {
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
  const currentTime = now.toLocaleTimeString('zh-CN', { hour12: false })

  // 简化的交易时间判断 (9:30-11:30, 13:00-15:00)
  const morning = (hour === 9 && minute >= 30) || (hour === 10) || (hour === 11 && minute <= 30)
  const afternoon = (hour === 13) || (hour === 14) || (hour === 15 && minute === 0)
  const isOpen = morning || afternoon

  let marketMessage = ''
  if (isOpen) {
    marketMessage = '交易中'
  } else if (hour < 9 || (hour === 9 && minute < 30)) {
    marketMessage = '休市中，开盘时间 09:30'
  } else if (hour === 11 && minute > 30 && hour < 13) {
    marketMessage = '午间休市，开盘时间 13:00'
  } else {
    marketMessage = '闭市，开盘时间 09:30'
  }

  return {
    isOpen,
    openTime: '09:30',
    closeTime: '15:00',
    currentTime,
    marketMessage
  }
}

export default stockService
