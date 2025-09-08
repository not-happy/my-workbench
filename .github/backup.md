### 单体仓库布局
- **根目录**: 使用 `concurrently` 进行工作区协调和开发服务器管理
- **`frontend/`**: Vue 3 + Vite + Tailwind CSS + TypeScript  
- **`backend/`**: Express + TypeScript，采用结构化的中间件/控制器/路由模式
- **`shared/`**: 通用 TypeScript 接口（User、ApiResponse、PaginatedResponse）

### 核心模式

**API 通信**: 所有前后端通信都通过 `frontend/src/services/apiService.ts` 使用 axios 和拦截器进行，为身份验证做好准备。API 调用使用 `shared/types.ts` 中的标准化响应格式。

**路由**: 
- 后端: `backend/src/routes/api.ts` 中的 RESTful 路由，采用控制器模式
- 前端: Vue Router 在 `App.vue` 中使用 Layout 组件

**状态管理**: 使用 Vue 3 Composition API 的 ref/reactive，无外部状态管理库

**样式**: 整个组件使用 Tailwind CSS 工具类，响应式优先的方法

## 开发工作流程

### 基本命令
```bash
# 首次设置
npm run install:all

# 开发模式（同时启动两个服务器）
npm run dev

# 单独服务
npm run dev:frontend  # Vite 开发服务器在 :5173
npm run dev:backend   # Express 在 :3001 使用 nodemon
```

### 服务器通信
- Vite 代理设置在开发期间将 `/api/*` 转发到后端
- CORS 配置为生产环境中的 `http://localhost:5173`
- 环境变量: `VITE_API_URL`（前端）、`PORT`/`FRONTEND_URL`（后端）

## 项目特定约定

### 组件结构
```
frontend/src/
├── components/     # 可复用 UI 组件（Layout、Navigation）
├── pages/         # 路由组件（Home、Users、About）  
├── services/      # API 层（apiService.ts）
├── types/         # 前端特定类型
```

### 后端结构
```
backend/src/
├── controllers/   # 业务逻辑（userController.ts）
├── middleware/    # Express 中间件（errorHandler.ts）
├── routes/        # 路由定义（api.ts）
├── index.ts       # 服务器设置和安全中间件
```

### 类型安全
- `shared/types.ts` 中的共享类型确保前后端约定
- 所有 API 响应的通用 `ApiResponse<T>` 包装器
- 前端类型在可能时扩展/使用共享类型

## 集成点

### API 模式
所有 API 端点遵循模式：`/api/{resource}` 使用标准 HTTP 动词。控制器返回 `ApiResponse<T>` 格式：
```typescript
{ success: boolean, data?: T, message?: string, error?: string }
```

### 错误处理
- 后端：`middleware/errorHandler.ts` 中的集中错误中间件  
- 前端：异步函数中的 try-catch，提供用户友好的中文错误消息
- 开发错误通过 `NODE_ENV` 检查包含堆栈跟踪

### 构建与部署
- 前端通过 Vite 构建到 `frontend/dist/`
- 后端将 TypeScript 编译到 `backend/dist/` 
- 生产环境：`npm start` 运行编译后的后端，提供前端静态文件

## 关键文件
- `package.json`（根目录）：工作区脚本和依赖项
- `frontend/src/services/apiService.ts`：所有 API 通信逻辑
- `backend/src/index.ts`：服务器设置、中间件、CORS 配置
- `shared/types.ts`：前后端之间的类型约定
- `frontend/vite.config.ts`：开发代理和构建配置