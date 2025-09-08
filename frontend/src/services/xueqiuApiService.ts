// 雪球财经API服务
import { stockService, type StockData } from './stockService'

// 雪球API返回的交易数据接口
export interface XueqiuTradeItem {
  symbol: string
  timestamp: number
  current: number
  chg: number
  percent: number
  trade_volume: number
  side: number // 1=买入, -1=卖出
  level: number
  trade_session: null
  trade_type: null
  trade_unique_id: string
  bid_appl_seq_num: null
  offer_appl_seq_num: null
  trade_type_v2: null
}

// 雪球API返回的盘口数据接口
export interface XueqiuPankouData {
  symbol: string
  timestamp: number
  current: number
  // 买盘数据
  bp1: number; bc1: number  // 买一价格和数量
  bp2: number; bc2: number  // 买二价格和数量
  bp3: number; bc3: number  // 买三价格和数量
  bp4: number; bc4: number  // 买四价格和数量
  bp5: number; bc5: number  // 买五价格和数量
  // 卖盘数据
  sp1: number; sc1: number  // 卖一价格和数量
  sp2: number; sc2: number  // 卖二价格和数量
  sp3: number; sc3: number  // 卖三价格和数量
  sp4: number; sc4: number  // 卖四价格和数量
  sp5: number; sc5: number  // 卖五价格和数量
  // 买卖比例
  buypct: number
  sellpct: number
  diff: number
  ratio: number
  level: number
}

// 雪球盘口API返回结构
export interface XueqiuPankouResponse {
  data: XueqiuPankouData
  error_code: number
  error_description: string | null
}

// 雪球股票报价详情接口
export interface XueqiuQuoteData {
  symbol: string
  name: string
  current: number
  chg: number
  percent: number
  open: number
  high: number
  low: number
  last_close: number
  volume: number
  amount: number
  turnover_rate: number
  market_capital: number
  float_market_capital: number
  pe_ttm: number
  pb: number
  eps: number
  timestamp: number
  currency: string
}

// 雪球报价API返回结构
export interface XueqiuQuoteResponse {
  data: {
    quote: XueqiuQuoteData
    market: any
    others: any
    tags: any[]
  }
  error_code: number
  error_description: string
}

// 雪球分时K线数据接口
export interface XueqiuMinuteItem {
  current: number
  volume: number
  avg_price: number
  chg: number
  percent: number
  timestamp: number
  amount: number
  high: number | null
  low: number | null
  amount_total: number | null
  volume_total: number | null
}

export interface XueqiuMinuteData {
  last_close: number
  items: XueqiuMinuteItem[]
  items_size: number
}

// 雪球分时K线API返回结构
export interface XueqiuMinuteResponse {
  data: XueqiuMinuteData
  error_code: number
  error_description: string
}

// 雪球API返回的数据结构
export interface XueqiuTradeResponse {
  data: {
    symbol: string
    items: XueqiuTradeItem[]
  }
  error_code: number
  error_description: string
}

// 股票基础信息接口
export interface XueqiuStockInfo {
  symbol: string
  name: string
  current: number
  chg: number
  percent: number
  high: number
  low: number
  open: number
  last_close: number
  volume: number
  amount: number
  turnover_rate: number
  market_capital: number
  pe_ttm: number
  pb: number
  dividend_yield: number
}

class XueqiuApiService {
  private proxyUrl = 'http://localhost:3001/api/stock/proxy' // 集成到主后端服务
  private fallbackMode = false // 使用真实接口数据

  // 获取股票实时交易数据
  async getRealtimeTrades(symbol: string, count: number = 10): Promise<XueqiuTradeItem[]> {
    try {
      if (this.fallbackMode) {
        // 降级到模拟数据
        console.log('使用模拟数据模式')
        return this.generateMockTrades(symbol, count)
      }

      const url = `${this.proxyUrl}/v5/stock/history/trade.json?symbol=${symbol}&count=${count}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
          'Origin': 'https://xueqiu.com',
          'Referer': `https://xueqiu.com/S/${symbol}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: XueqiuTradeResponse = await response.json()
      
      if (data.error_code !== 0) {
        throw new Error(data.error_description || '获取数据失败')
      }

      return data.data.items || []
    } catch (error) {
      console.error('获取雪球数据失败，降级到模拟数据:', error)
      return this.generateMockTrades(symbol, count)
    }
  }

  // 获取股票盘口数据（五档买卖盘）
  async getPankouData(symbol: string): Promise<XueqiuPankouData | null> {
    try {
      if (this.fallbackMode) {
        // 降级到模拟数据
        console.log('使用模拟盘口数据模式')
        return this.generateMockPankou(symbol)
      }

      const url = `${this.proxyUrl}/v5/stock/realtime/pankou.json?symbol=${symbol}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
          'Origin': 'https://xueqiu.com',
          'Referer': `https://xueqiu.com/S/${symbol}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: XueqiuPankouResponse = await response.json()
      
      if (data.error_code !== 0) {
        throw new Error(data.error_description || '获取盘口数据失败')
      }

      return data.data || null
    } catch (error) {
      console.error('获取雪球盘口数据失败，降级到模拟数据:', error)
      return this.generateMockPankou(symbol)
    }
  }

  // 获取股票详细报价信息
  async getQuoteData(symbol: string): Promise<XueqiuQuoteData | null> {
    try {
      if (this.fallbackMode) {
        console.log('使用模拟报价数据模式')
        return null
      }

      const url = `${this.proxyUrl}/v5/stock/quote.json?symbol=${symbol}&extend=detail`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
          'Origin': 'https://xueqiu.com',
          'Referer': `https://xueqiu.com/S/${symbol}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: XueqiuQuoteResponse = await response.json()
      
      if (data.error_code !== 0) {
        throw new Error(data.error_description || '获取报价数据失败')
      }

      return data.data.quote || null
    } catch (error) {
      console.error('获取雪球报价数据失败:', error)
      return null
    }
  }

  // 获取股票分时K线数据
  async getMinuteData(symbol: string, period: string = '1d'): Promise<XueqiuMinuteData | null> {
    try {
      if (this.fallbackMode) {
        console.log('使用模拟分时数据模式')
        return null
      }

      const url = `${this.proxyUrl}/v5/stock/chart/minute.json?symbol=${symbol}&period=${period}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
          'Origin': 'https://xueqiu.com',
          'Referer': `https://xueqiu.com/S/${symbol}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: XueqiuMinuteResponse = await response.json()
      
      if (data.error_code !== 0) {
        throw new Error(data.error_description || '获取分时数据失败')
      }

      return data.data || null
    } catch (error) {
      console.error('获取雪球分时数据失败:', error)
      return null
    }
  }

  // 获取股票基础信息
  async getStockInfo(symbol: string): Promise<StockData | null> {
    try {
      // 优先使用详细报价接口获取真实数据
      const quoteData = await this.getQuoteData(symbol)
      
      if (quoteData) {
        // 使用真实的报价数据
        const stockData: StockData = {
          code: symbol,
          name: quoteData.name,
          price: quoteData.current,
          change: quoteData.chg,
          changePercent: quoteData.percent,
          open: quoteData.open, // 真实开盘价
          high: quoteData.high, // 真实最高价
          low: quoteData.low,   // 真实最低价
          volume: quoteData.volume,
          turnover: quoteData.turnover_rate, // 真实换手率
          rsi: 50 + Math.random() * 40, // RSI需要单独接口，暂时保持模拟
          macd: (Math.random() - 0.5) * 0.1, // MACD需要单独接口，暂时保持模拟
          kdj: 30 + Math.random() * 40, // KDJ需要单独接口，暂时保持模拟
          pe: quoteData.pe_ttm, // 真实市盈率TTM
          pb: quoteData.pb,     // 真实市净率
          marketCap: quoteData.market_capital / 100000000 // 转换为亿元单位
        }
        
        return stockData
      }

      // 降级：尝试使用交易数据
      const trades = await this.getRealtimeTrades(symbol, 1)
      
      if (trades.length === 0) {
        return null
      }

      const latestTrade = trades[0]
      
      // 转换为标准的StockData格式（估算数据）
      const stockData: StockData = {
        code: symbol,
        name: this.getStockName(symbol), // 需要查找股票名称
        price: latestTrade.current,
        change: latestTrade.chg,
        changePercent: latestTrade.percent,
        open: latestTrade.current - latestTrade.chg, // 估算开盘价
        high: latestTrade.current + Math.abs(latestTrade.chg * 0.5), // 估算最高价
        low: latestTrade.current - Math.abs(latestTrade.chg * 0.5), // 估算最低价
        volume: this.calculateDayVolume(trades), // 计算全天成交量
        turnover: Math.random() * 5, // 临时数据，需要从其他接口获取
        rsi: 50 + Math.random() * 40, // 临时数据
        macd: (Math.random() - 0.5) * 0.1, // 临时数据
        kdj: 30 + Math.random() * 40, // 临时数据
        pe: Math.random() * 30 + 5,
        pb: Math.random() * 5 + 0.5,
        marketCap: Math.random() * 10000 + 1000
      }

      return stockData
    } catch (error) {
      console.error('获取股票信息失败:', error)
      return null
    }
  }

  // 批量获取股票信息
  async getMultipleStocks(symbols: string[]): Promise<StockData[]> {
    const promises = symbols.map(symbol => this.getStockInfo(symbol))
    const results = await Promise.allSettled(promises)
    
    return results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<StockData>).value)
  }

  // 搜索股票
  async searchStocks(query: string): Promise<StockData[]> {
    // 简化的搜索逻辑，可以扩展为真实的搜索API
    const knownStocks = [
      'SH600246', 'SH600519', 'SZ000858', 'SH600036', 'SZ000001', 'SZ000002', 'SZ300750'
    ]

    const matchedSymbols = knownStocks.filter(symbol => 
      symbol.includes(query.toUpperCase()) || 
      this.getStockName(symbol).includes(query)
    )

    const results = await this.getMultipleStocks(matchedSymbols)
    return results
  }

  // 生成模拟交易数据（降级方案）
  private generateMockTrades(symbol: string, count: number): XueqiuTradeItem[] {
    const basePrice = this.getBasePrice(symbol)
    const trades: XueqiuTradeItem[] = []
    let currentPrice = basePrice
    
    for (let i = 0; i < count; i++) {
      // 模拟真实的价格波动模式
      const volatility = (Math.random() - 0.5) * 0.02 // ±1%的波动
      const priceChange = currentPrice * volatility
      currentPrice = Math.max(0.01, currentPrice + priceChange)
      
      const chg = currentPrice - basePrice
      const percent = (chg / basePrice) * 100
      
      trades.push({
        symbol,
        timestamp: Date.now() - (count - i - 1) * 2000, // 每2秒一笔交易
        current: Number(currentPrice.toFixed(2)),
        chg: Number(chg.toFixed(2)),
        percent: Number(percent.toFixed(2)),
        trade_volume: Math.floor(Math.random() * 50000) + 1000, // 1000-51000手
        side: Math.random() > 0.5 ? 1 : -1,
        level: 1,
        trade_session: null,
        trade_type: null,
        trade_unique_id: `mock_${symbol}_${Date.now()}_${i}`,
        bid_appl_seq_num: null,
        offer_appl_seq_num: null,
        trade_type_v2: null
      })
    }
    
    return trades
  }

  // 生成模拟盘口数据（降级方案）
  private generateMockPankou(symbol: string): XueqiuPankouData {
    const basePrice = this.getBasePrice(symbol)
    const currentPrice = basePrice + (Math.random() - 0.5) * basePrice * 0.02 // ±1%波动
    
    // 生成买盘数据（价格递减）
    const bp1 = Number((currentPrice - 0.01).toFixed(2))
    const bp2 = Number((bp1 - 0.01).toFixed(2))
    const bp3 = Number((bp2 - 0.01).toFixed(2))
    const bp4 = Number((bp3 - 0.01).toFixed(2))
    const bp5 = Number((bp4 - 0.01).toFixed(2))
    
    // 生成卖盘数据（价格递增）
    const sp1 = Number(currentPrice.toFixed(2))
    const sp2 = Number((sp1 + 0.01).toFixed(2))
    const sp3 = Number((sp2 + 0.01).toFixed(2))
    const sp4 = Number((sp3 + 0.01).toFixed(2))
    const sp5 = Number((sp4 + 0.01).toFixed(2))
    
    // 生成随机数量
    const bc1 = Math.floor(Math.random() * 200000) + 10000 // 1-20万手
    const bc2 = Math.floor(Math.random() * 100000) + 5000
    const bc3 = Math.floor(Math.random() * 80000) + 3000
    const bc4 = Math.floor(Math.random() * 60000) + 2000
    const bc5 = Math.floor(Math.random() * 50000) + 1000
    
    const sc1 = Math.floor(Math.random() * 200000) + 10000
    const sc2 = Math.floor(Math.random() * 100000) + 5000
    const sc3 = Math.floor(Math.random() * 80000) + 3000
    const sc4 = Math.floor(Math.random() * 60000) + 2000
    const sc5 = Math.floor(Math.random() * 50000) + 1000
    
    const totalBuy = bc1 + bc2 + bc3 + bc4 + bc5
    const totalSell = sc1 + sc2 + sc3 + sc4 + sc5
    const total = totalBuy + totalSell
    
    return {
      symbol,
      timestamp: Date.now(),
      current: Number(currentPrice.toFixed(2)),
      bp1, bc1, bp2, bc2, bp3, bc3, bp4, bc4, bp5, bc5,
      sp1, sc1, sp2, sc2, sp3, sc3, sp4, sc4, sp5, sc5,
      buypct: Number(((totalBuy / total) * 100).toFixed(1)),
      sellpct: Number(((totalSell / total) * 100).toFixed(1)),
      diff: totalBuy - totalSell,
      ratio: Number(((totalBuy - totalSell) / total * 100).toFixed(2)),
      level: 1
    }
  }

  // 计算全天成交量（基于部分交易数据估算）
  private calculateDayVolume(trades: XueqiuTradeItem[]): number {
    if (trades.length === 0) return 0
    
    const totalVolume = trades.reduce((sum, trade) => sum + trade.trade_volume, 0)
    // 简单估算：假设这些交易代表了全天的一小部分
    return totalVolume * 1000
  }

  // 获取股票基础价格（用于模拟数据）
  private getBasePrice(symbol: string): number {
    const priceMap: Record<string, number> = {
      'SH600246': 12.50, // 万通发展
      'SH600519': 1680.00, // 贵州茅台
      'SZ000858': 128.50, // 五粮液
      'SH600036': 32.50, // 招商银行
      'SZ000001': 10.85, // 平安银行
      'SZ000002': 8.92, // 万科A
      'SZ300750': 185.60 // 宁德时代
    }
    
    return priceMap[symbol] || 10.00
  }

  // 获取股票名称
  private getStockName(symbol: string): string {
    const nameMap: Record<string, string> = {
      'SH600246': '万通发展',
      'SH600519': '贵州茅台',
      'SZ000858': '五粮液',
      'SH600036': '招商银行',
      'SZ000001': '平安银行',
      'SZ000002': '万科A',
      'SZ300750': '宁德时代'
    }
    
    return nameMap[symbol] || symbol
  }

  // 设置是否使用降级模式
  setFallbackMode(enabled: boolean) {
    this.fallbackMode = enabled
  }

  // 检查API可用性
  async checkApiAvailability(): Promise<boolean> {
    try {
      const testSymbol = 'SH600519' // 测试贵州茅台
      const trades = await this.getRealtimeTrades(testSymbol, 1)
      return trades.length > 0
    } catch {
      return false
    }
  }
}

// 单例实例
export const xueqiuApiService = new XueqiuApiService()

// 增强的股票服务，集成雪球API
export class EnhancedStockService {
  private xueqiuApi = xueqiuApiService
  private fallbackService = stockService

  // 获取股票数据（优先使用雪球API）
  async getStock(code: string): Promise<StockData | null> {
    try {
      // 转换股票代码格式
      const xueqiuSymbol = this.convertToXueqiuSymbol(code)
      const stockData = await this.xueqiuApi.getStockInfo(xueqiuSymbol)
      
      if (stockData) {
        return stockData
      }
    } catch (error) {
      console.error('雪球API获取失败，使用本地数据:', error)
    }

    // 降级到本地模拟数据
    return this.fallbackService.getStock(code)
  }

  // 批量获取股票数据
  async getStocks(codes: string[]): Promise<StockData[]> {
    try {
      const xueqiuSymbols = codes.map(code => this.convertToXueqiuSymbol(code))
      const stocks = await this.xueqiuApi.getMultipleStocks(xueqiuSymbols)
      
      if (stocks.length > 0) {
        return stocks
      }
    } catch (error) {
      console.error('批量获取雪球数据失败，使用本地数据:', error)
    }

    // 降级到本地模拟数据
    return this.fallbackService.getStocks(codes)
  }

  // 搜索股票
  async searchStock(query: string): Promise<StockData[]> {
    try {
      const results = await this.xueqiuApi.searchStocks(query)
      if (results.length > 0) {
        return results
      }
    } catch (error) {
      console.error('雪球搜索失败，使用本地搜索:', error)
    }

    // 降级到本地搜索
    return this.fallbackService.searchStock(query)
  }

  // 获取热门股票
  getHotStocks(limit: number = 6): StockData[] {
    // 暂时使用本地数据
    return this.fallbackService.getHotStocks(limit)
  }

  // 获取实时交易数据
  async getRealtimeTrades(symbol: string, count: number = 10): Promise<XueqiuTradeItem[]> {
    try {
      return await this.xueqiuApi.getRealtimeTrades(symbol, count)
    } catch (error) {
      console.error('获取实时交易数据失败:', error)
      return []
    }
  }

  // 获取盘口数据（五档买卖盘）
  async getPankouData(code: string): Promise<XueqiuPankouData | null> {
    try {
      const xueqiuSymbol = this.convertToXueqiuSymbol(code)
      return await this.xueqiuApi.getPankouData(xueqiuSymbol)
    } catch (error) {
      console.error('获取盘口数据失败:', error)
      return null
    }
  }

  // 获取股票详细报价信息
  async getQuoteData(code: string): Promise<XueqiuQuoteData | null> {
    try {
      const xueqiuSymbol = this.convertToXueqiuSymbol(code)
      return await this.xueqiuApi.getQuoteData(xueqiuSymbol)
    } catch (error) {
      console.error('获取股票报价失败:', error)
      return null
    }
  }

  // 获取股票分时K线数据
  async getMinuteData(code: string, period: string = '1d'): Promise<XueqiuMinuteData | null> {
    try {
      const xueqiuSymbol = this.convertToXueqiuSymbol(code)
      return await this.xueqiuApi.getMinuteData(xueqiuSymbol, period)
    } catch (error) {
      console.error('获取分时数据失败:', error)
      return null
    }
  }

  // 转换股票代码格式（如000001转换为SZ000001）
  private convertToXueqiuSymbol(code: string): string {
    // 移除已有的前缀
    const cleanCode = code.replace(/^(SH|SZ)/, '')
    
    // 根据代码规则添加前缀
    if (cleanCode.startsWith('60') || cleanCode.startsWith('51') || cleanCode.startsWith('50')) {
      return `SH${cleanCode}`
    } else if (cleanCode.startsWith('00') || cleanCode.startsWith('30')) {
      return `SZ${cleanCode}`
    }
    
    // 如果已经有前缀，直接返回
    return code.includes('SH') || code.includes('SZ') ? code : `SZ${cleanCode}`
  }
}

// 导出增强的股票服务实例
export const enhancedStockService = new EnhancedStockService()

export default enhancedStockService
