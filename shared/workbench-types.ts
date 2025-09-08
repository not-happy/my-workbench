// 工具系统类型定义

export interface WorkbenchTool {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  category: 'development' | 'testing' | 'automation' | 'utility' | 'analysis'
  displayMode: 'inline' | 'modal' | 'fullscreen'
  component?: string // 组件名称
  lastUsed?: string
  usage: number
  status: 'active' | 'beta' | 'deprecated'
  tags: string[]
  version: string
}

export interface ToolCategory {
  id: string
  name: string
  description: string
  icon: string
  tools: WorkbenchTool[]
}

export interface ToolUsageStats {
  toolId: string
  usageCount: number
  lastUsed: string
  totalTime: number // 使用总时长（分钟）
}

export interface WorkbenchState {
  activeToolId: string | null
  toolExpanded: boolean
  selectedCategory: string | null
  toolStats: ToolUsageStats[]
}
