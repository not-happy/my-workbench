import type { WorkbenchTool, ToolCategory } from '../../../shared/workbench-types'

// 工具注册中心
export class ToolRegistry {
  private static tools: Map<string, WorkbenchTool> = new Map()
  private static categories: Map<string, ToolCategory> = new Map()

  // 注册工具
  static registerTool(tool: WorkbenchTool) {
    this.tools.set(tool.id, tool)
  }

  // 注册分类
  static registerCategory(category: ToolCategory) {
    this.categories.set(category.id, category)
  }

  // 获取所有工具
  static getAllTools(): WorkbenchTool[] {
    return Array.from(this.tools.values())
  }

  // 获取所有分类
  static getAllCategories(): ToolCategory[] {
    return Array.from(this.categories.values())
  }

  // 根据分类获取工具
  static getToolsByCategory(categoryId: string): WorkbenchTool[] {
    return this.getAllTools().filter(tool => tool.category === categoryId)
  }

  // 获取工具
  static getTool(toolId: string): WorkbenchTool | undefined {
    return this.tools.get(toolId)
  }

  // 搜索工具
  static searchTools(query: string): WorkbenchTool[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllTools().filter(tool => 
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
}

// 预定义的工具
export const predefinedTools: WorkbenchTool[] = [
  {
    id: 'supplier-test',
    name: '供应商对接测试',
    description: '全流程机票供应商API测试工具，支持搜索、验价、生单、出票等完整流程',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
    </svg>`,
    iconBg: 'bg-blue-100 text-blue-600',
    category: 'testing',
    displayMode: 'fullscreen',
    component: 'SupplierTestTool',
    lastUsed: '2024-12-20',
    usage: 15,
    status: 'active',
    tags: ['API', '测试', '供应商', '机票', '航班'],
    version: '1.0.0'
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化工具',
    description: '美化、压缩和验证JSON数据，支持语法高亮和错误检测',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
    </svg>`,
    iconBg: 'bg-green-100 text-green-600',
    category: 'utility',
    displayMode: 'modal',
    component: 'JsonFormatterTool',
    lastUsed: '2024-12-19',
    usage: 28,
    status: 'active',
    tags: ['JSON', '格式化', '验证', '开发'],
    version: '1.2.0'
  },
  {
    id: 'base64-encoder',
    name: 'Base64 编解码',
    description: 'Base64字符串的编码和解码工具，支持文本和文件',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>`,
    iconBg: 'bg-purple-100 text-purple-600',
    category: 'utility',
    displayMode: 'inline',
    component: 'Base64Tool',
    lastUsed: '2024-12-18',
    usage: 12,
    status: 'active',
    tags: ['Base64', '编码', '解码', '工具'],
    version: '1.0.0'
  },
  {
    id: 'json-to-java',
    name: 'JSON转Java实体类',
    description: '将JSON报文自动转换为Java实体类代码，支持嵌套对象和多种代码风格',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>`,
    iconBg: 'bg-red-100 text-red-600',
    category: 'development',
    displayMode: 'fullscreen',
    component: 'JsonToJavaConverter',
    lastUsed: '2024-12-20',
    usage: 5,
    status: 'active',
    tags: ['JSON', 'Java', '实体类', '代码生成', '开发'],
    version: '1.0.0'
  },
  {
    id: 'api-tester',
    name: 'API 测试工具',
    description: '通用的HTTP API测试工具，支持GET、POST、PUT、DELETE等请求',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
    </svg>`,
    iconBg: 'bg-orange-100 text-orange-600',
    category: 'testing',
    displayMode: 'fullscreen',
    component: 'ApiTesterTool',
    lastUsed: '2024-12-17',
    usage: 22,
    status: 'beta',
    tags: ['API', 'HTTP', '测试', '请求'],
    version: '0.9.0'
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '专业的颜色选择和调色板工具，支持多种颜色格式',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z"/>
    </svg>`,
    iconBg: 'bg-pink-100 text-pink-600',
    category: 'utility',
    displayMode: 'modal',
    component: 'ColorPickerTool',
    lastUsed: '2024-12-16',
    usage: 8,
    status: 'active',
    tags: ['颜色', '设计', '调色板', 'CSS'],
    version: '1.0.0'
  },
  {
    id: 'stock-monitor',
    name: '股票盯盘助手',
    description: '短线盯盘工具，实时监控股价、技术指标、资金流向等关键信息',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
    </svg>`,
    iconBg: 'bg-emerald-100 text-emerald-600',
    category: 'analysis',
    displayMode: 'fullscreen',
    component: 'StockMonitorTool',
    lastUsed: '2025-09-08',
    usage: 1,
    status: 'active',
    tags: ['股票', '盯盘', '短线', '技术分析', '实时监控'],
    version: '1.1.0'
  },
  {
    id: 'qr-generator',
    name: '二维码生成器',
    description: '生成自定义二维码，支持文本、URL、WiFi等多种类型',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
    </svg>`,
    iconBg: 'bg-indigo-100 text-indigo-600',
    category: 'utility',
    displayMode: 'modal',
    component: 'QrGeneratorTool',
    lastUsed: '2024-12-15',
    usage: 5,
    status: 'active',
    tags: ['二维码', 'QR', '生成器', '扫码'],
    version: '1.0.0'
  }
]

// 预定义的分类
export const predefinedCategories: ToolCategory[] = [
  {
    id: 'testing',
    name: '测试工具',
    description: 'API测试、接口调试、功能验证等测试相关工具',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
    </svg>`,
    tools: []
  },
  {
    id: 'utility',
    name: '实用工具',
    description: '日常开发和工作中的实用小工具',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
    </svg>`,
    tools: []
  },
  {
    id: 'development',
    name: '开发工具',
    description: '代码开发、调试、优化相关工具',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
    </svg>`,
    tools: []
  },
  {
    id: 'automation',
    name: '自动化工具',
    description: '工作流程自动化、批处理等工具',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>`,
    tools: []
  },
  {
    id: 'analysis',
    name: '分析工具',
    description: '数据分析、日志分析、性能分析等工具',
    icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>`,
    tools: []
  }
]

// 初始化工具注册中心
export function initializeToolRegistry() {
  // 注册分类
  predefinedCategories.forEach(category => {
    ToolRegistry.registerCategory(category)
  })

  // 注册工具
  predefinedTools.forEach(tool => {
    ToolRegistry.registerTool(tool)
  })
}
