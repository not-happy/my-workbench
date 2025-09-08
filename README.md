# 个人工作台

一个基于Vue 3和Node.js构建的现代化个人效率管理平台，具备TypeScript、Tailwind CSS、深色模式支持和Express.js等技术特性。

## 🚀 功能特性

### 前端
- **Vue 3** 搭配 Composition API 和 TypeScript
- **Vite** 快速开发和构建
- **Tailwind CSS** 响应式样式设计
- **深色/浅色主题切换** 用户友好的主题系统
- **Vue Router** 客户端路由
- **Axios** API通信
- 响应式设计
- 现代组件架构

### 后端
- **Node.js** 搭配 **Express.js**
- **TypeScript** 类型安全
- **CORS** 跨域请求支持
- **Helmet** 安全头设置
- **Morgan** 日志记录
- 错误处理中间件
- RESTful API 架构

### 工具集成
- **JSON to Java 转换器** - 快速将JSON数据转换为Java类定义
- **供应商测试工具** - 接口测试和验证工具
- **股票盯盘助手** - 实时股票监控和交易数据分析
  - 支持雪球财经API集成
  - 实时价格监控和交易数据
  - 本地持久化存储
  - 智能降级策略
  - 一屏式紧凑展示
- 可扩展的工具架构

## 🎨 主题功能

该应用支持完整的深色/浅色主题切换：

- **自动主题检测** - 根据系统偏好自动选择主题
- **手动切换** - 导航栏中的主题切换按钮
- **持久化存储** - 主题偏好自动保存到localStorage
- **平滑过渡** - 所有组件支持无缝的主题切换动画
- **无障碍支持** - 支持prefers-reduced-motion偏好

### 主题实现方式
- 使用Tailwind CSS的`dark:`前缀类
- 基于`class`策略而非`media`策略，实现手动控制
- 通过`useTheme`组合式函数管理全局主题状态

## 📁 项目结构

```
personal-workbench/
├── frontend/          # Vue 3前端应用
│   ├── src/
│   │   ├── components/     # Vue组件
│   │   │   ├── ui/        # UI组件库
│   │   │   ├── workbench/ # 工作台组件
│   │   │   └── supplier/  # 供应商相关组件
│   │   ├── composables/   # 组合式函数
│   │   │   └── useTheme.ts # 主题管理
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API服务
│   │   ├── utils/         # 工具函数
│   │   └── ...
│   ├── package.json
│   ├── tailwind.config.js # Tailwind配置
│   └── vite.config.ts
├── backend/           # Node.js后端应用
│   ├── src/
│   │   ├── controllers/   # 路由控制器
│   │   ├── middleware/    # Express中间件
│   │   ├── routes/        # API路由
│   │   └── index.ts       # 主服务器文件
│   ├── package.json
│   └── tsconfig.json
├── shared/            # 共享类型和工具
│   ├── types.ts
│   ├── supplier-types.ts
│   └── workbench-types.ts
├── package.json       # 根package.json和工作区脚本
└── README.md
```

## 🛠️ 快速开始

### 前置要求
- Node.js (v18 或更高版本)
- npm 或 yarn

### 安装步骤

1. **克隆或导航到项目目录**
   ```bash
   cd personal-workbench
   ```

2. **安装所有依赖**
   ```bash
   npm run install:all
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

这将启动：
- 前端开发服务器 `http://localhost:5173`
- 后端服务器 `http://localhost:3001`

### 或者：单独启动服务器

**启动后端：**
```bash
cd backend
npm run dev
```

**启动前端：**
```bash
cd frontend
npm run dev
```

## 📚 可用脚本

### 根目录
- `npm run dev` - 同时启动前端和后端开发模式
- `npm run install:all` - 安装所有包的依赖
- `npm run build` - 构建前端和后端生产版本
- `npm start` - 启动生产环境后端服务器

### 前端 (`/frontend`)
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行ESLint

### 后端 (`/backend`)
- `npm run dev` - 启动开发服务器(热重载)
- `npm run build` - 编译TypeScript到JavaScript
- `npm start` - 启动生产服务器
- `npm run lint` - 运行ESLint

## 🔧 API 接口

后端提供以下API接口：

### 健康检查
- `GET /health` - 服务器健康检查

### 供应商测试
- `POST /api/supplier/test` - 供应商接口测试
- `GET /api/supplier/config` - 获取供应商配置

### 示例
- `GET /api/hello` - 简单的hello接口

## 🎨 前端页面

- **首页** (`/`) - 工作台主页，包含工具总览和快速访问
- **JSON to Java转换器** (`/tools/json-to-java`) - 代码生成工具
- **供应商测试工具** (`/tools/supplier-test`) - 接口测试工具
- **关于** (`/about`) - 项目信息页面

所有页面都支持深色/浅色主题切换。

## ⚙️ 配置

### 环境变量

**后端** (在 `/backend` 目录下的 `.env` 文件):
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**前端** (在 `/frontend` 目录下的 `.env` 文件):
```env
VITE_API_URL=http://localhost:3001/api
```

### 开发设置

项目配置包括：
- **热模块替换** Vue组件热更新
- **Nodemon** 后端自动重启
- **TypeScript** 前后端编译
- **ESLint** 代码质量检查
- **Tailwind CSS** 样式设计和深色模式支持
- **Vite代理设置** 开发期间的API调用
- **主题系统** 自动主题检测和切换

## 🎯 主题开发指南

### 添加新组件的主题支持

1. **使用Tailwind的dark前缀**：
   ```vue
   <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
     内容
   </div>
   ```

2. **使用useTheme组合式函数**：
   ```typescript
   import { useTheme } from '@/composables/useTheme'
   
   const { theme, toggleTheme } = useTheme()
   ```

3. **遵循颜色方案**：
   - 浅色模式：`bg-white`, `text-gray-900`, `border-gray-200`
   - 深色模式：`dark:bg-gray-800`, `dark:text-white`, `dark:border-gray-700`

## 🚀 生产构建

1. **构建应用：**
   ```bash
   npm run build
   ```

2. **启动生产服务器：**
   ```bash
   npm start
   ```

前端将构建到 `/frontend/dist`，后端将构建到 `/backend/dist`。

## 📝 开发说明

### 添加新功能

1. **前端组件**: 添加到 `/frontend/src/components/`
   - UI组件放入 `/components/ui/`
   - 工作台组件放入 `/components/workbench/`
   - 确保添加dark mode样式支持

2. **后端路由**: 添加到 `/backend/src/routes/`
3. **API服务**: 更新 `/frontend/src/services/apiService.ts`
4. **类型定义**: 添加共享类型到 `/shared/` 目录
5. **新工具**: 在 `/frontend/src/utils/toolRegistry.ts` 中注册

### 添加新工具页面

1. 在 `/frontend/src/pages/tools/` 创建新页面组件
2. 在路由中注册新页面
3. 在工具注册表中添加工具信息
4. 确保包含完整的主题支持

### 数据库集成

要添加数据库支持：
1. 安装首选的数据库客户端 (如 `mongoose` for MongoDB, `pg` for PostgreSQL)
2. 添加数据库配置到后端 `.env`
3. 在 `/backend/src/models/` 创建数据库模型
4. 更新控制器以使用数据库而不是内存数据

### 身份验证

要添加身份验证：
1. 安装JWT库: `npm install jsonwebtoken @types/jsonwebtoken`
2. 在 `/backend/src/middleware/` 创建认证中间件
3. 添加登录/注册路由
4. 在前端实现令牌存储和管理

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

此项目采用 MIT 许可证。

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Vue Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Express.js 文档](https://expressjs.com/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [TypeScript 文档](https://www.typescriptlang.org/)
