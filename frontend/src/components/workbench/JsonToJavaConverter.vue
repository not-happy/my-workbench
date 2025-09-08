<template>
  <div class="json-to-java-converter h-full flex flex-col bg-white dark:bg-gray-800 transition-colors duration-200">
    <!-- 头部 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">JSON to Java 转换器</h1>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">将JSON数据转换为Java POJO类</p>
        </div>
        
        <!-- 配置区域 -->
        <div class="flex items-center gap-4">
          <!-- 配置选项卡片 -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-4">
            <div class="flex items-center gap-2">
              <label for="packageName" class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">包名:</label>
              <input
                id="packageName"
                v-model="settings.packageName"
                type="text"
                placeholder="com.example.model"
                class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            
            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            
            <div class="flex items-center gap-2">
              <label for="rootClassName" class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">根类名:</label>
              <input
                id="rootClassName"
                v-model="settings.rootClassName"
                type="text"
                placeholder="RootClass"
                class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm w-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            
            <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            
            <div class="flex items-center gap-2">
              <label for="classPrefix" class="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">类名前缀:</label>
              <input
                id="classPrefix"
                v-model="settings.classPrefix"
                type="text"
                placeholder="可选"
                class="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm w-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <button
            @click="generateJavaClasses"
            :disabled="!parsedJson"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3"></path>
            </svg>
            生成Java类
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧JSON输入 -->
      <div class="w-1/2 border-r border-gray-200 dark:border-gray-700">
        <Suspense>
          <template #default>
            <JsonTreeViewer
              :initial-json="jsonInput"
              @json-change="handleJsonChange"
              @json-input-change="handleJsonInputChange"
            />
          </template>
          <template #fallback>
            <div class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400">加载JSON编辑器...</p>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
      
      <!-- 右侧Java输出 -->
      <div class="w-1/2">
        <Suspense>
          <template #default>
            <JavaClassList
              :classes="javaClasses"
              :package-name="settings.packageName"
              :root-class-name="settings.rootClassName"
              :class-prefix="settings.classPrefix"
              @class-updated="handleClassUpdated"
              @root-class-name-change="handleRootClassNameChange"
            />
          </template>
          <template #fallback>
            <div class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400">加载Java类列表...</p>
              </div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineAsyncComponent } from 'vue'

// 懒加载子组件
const JsonTreeViewer = defineAsyncComponent(() => import('../ui/JsonTreeViewer.vue'))
const JavaClassList = defineAsyncComponent(() => import('../ui/JavaClassList.vue'))

interface JavaField {
  name: string
  type: string
  comment?: string
}

interface JavaClass {
  className: string
  packagePath?: string
  fields: JavaField[]
  code: string
}

// 响应式数据
const jsonInput = ref('')
const jsonError = ref('')
const parsedJson = ref<any>(null)
const javaClasses = ref<JavaClass[]>([])

// 缓存键名
const CACHE_KEY = 'json-to-java-settings'

// 从localStorage加载设置
const loadSettingsFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsedSettings = JSON.parse(cached)
      return {
        rootClassName: parsedSettings.rootClassName || 'RootClass',
        packageName: parsedSettings.packageName || 'com.example.model',
        generateGettersSetters: parsedSettings.generateGettersSetters !== false,
        classPrefix: parsedSettings.classPrefix || ''
      }
    }
  } catch (error) {
    console.warn('Failed to load settings from cache:', error)
  }
  return {
    rootClassName: 'RootClass',
    packageName: 'com.example.model',
    generateGettersSetters: true,
    classPrefix: ''
  }
}

// 保存设置到localStorage
const saveSettingsToCache = (settingsData: any) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(settingsData))
  } catch (error) {
    console.warn('Failed to save settings to cache:', error)
  }
}

// 默认设置 - 从缓存加载
const settings = ref(loadSettingsFromCache())

// 监听设置变更，自动保存到缓存
watch(settings, (newSettings) => {
  saveSettingsToCache(newSettings)
}, { deep: true })

// 组件挂载时触发初始化
onMounted(() => {
  // 如果有缓存的JSON输入，也可以在这里恢复
  console.log('JsonToJavaConverter mounted with cached settings:', settings.value)
})

// 示例JSON数据
const exampleJson = `{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "profile": {
          "name": "张三",
          "email": "zhangsan@example.com"
        },
        "tags": ["admin", "user"],
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 100
    }
  },
  "timestamp": 1625097600,
  "user": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "isVip": true,
    "age": 35
  }
}`

// 初始化示例数据
jsonInput.value = exampleJson

// 处理JSON变化（来自JsonTreeViewer）
const handleJsonChange = (json: any) => {
  parsedJson.value = json
  jsonError.value = ''
}

// 处理JSON输入变化（来自JsonTreeViewer）
const handleJsonInputChange = (input: string) => {
  jsonInput.value = input
}

// 处理类更新（来自JavaClassList）
const handleClassUpdated = (classes: JavaClass[]) => {
  javaClasses.value = classes
}

// 处理根类名变更（来自JavaClassList）
const handleRootClassNameChange = (newName: string) => {
  settings.value.rootClassName = newName
}

// 首字母大写
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// 生成带前缀的类名
const generateClassName = (baseName: string): string => {
  const className = capitalize(baseName)
  return settings.value.classPrefix ? `${settings.value.classPrefix}${className}` : className
}

// 生成Java类型
const getJavaType = (value: any): string => {
  if (value === null || value === undefined) return 'Object'
  
  const type = typeof value
  switch (type) {
    case 'boolean':
      return 'Boolean'
    case 'number':
      return Number.isInteger(value) ? 'Integer' : 'BigDecimal'
    case 'string':
      return 'String'
    case 'object':
      if (Array.isArray(value)) {
        if (value.length === 0) return 'List<Object>'
        const firstItem = value[0]
        if (typeof firstItem === 'object' && firstItem !== null) {
          return `List<Object>` // 这里会在后续处理中更新
        }
        const itemType = getJavaType(firstItem)
        return `List<${itemType}>`
      }
      return 'Object' // 嵌套对象会生成单独的类
    default:
      return 'Object'
  }
}

// 生成Java类
const generateJavaClasses = () => {
  if (!parsedJson.value) return

  const classes: JavaClass[] = []
  const classMapping: { [key: string]: string } = {}
  const generatedClasses = new Set<string>() // 记录已生成的类名，避免重复
  
  // 收集所有需要生成的类
  const collectClasses = (obj: any, keyName: string = '', parentKey: string = '') => {
    if (typeof obj !== 'object' || obj === null) return
    
    if (Array.isArray(obj)) {
      // 对于数组，只处理第一个元素来确定类型，避免重复
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        const itemClassName = generateClassName(keyName.replace(/s$/, ''))
        classMapping[`${parentKey}.${keyName}[0]`] = itemClassName
        collectClasses(obj[0], keyName, `${parentKey}.${keyName}[0]`)
      }
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedClassName = generateClassName(key)
          classMapping[`${parentKey}.${key}`] = nestedClassName
          collectClasses(value, key, `${parentKey}.${key}`)
        } else if (Array.isArray(value)) {
          collectClasses(value, key, parentKey)
        }
      })
    }
  }
  
  // 收集类信息
  collectClasses(parsedJson.value, 'root', '')
  
  // 生成单个类
  const generateClass = (obj: any, className: string, keyPath: string = ''): JavaClass => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return {
        className,
        fields: [],
        code: ''
      }
    }

    const fields: JavaField[] = []

    // 分析字段
    Object.entries(obj).forEach(([key, value]) => {
      let javaType = getJavaType(value)
      
      // 处理嵌套对象
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedPath = keyPath ? `${keyPath}.${key}` : key
        javaType = classMapping[nestedPath] || generateClassName(key)
      }

      // 处理数组中的对象
      if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        const arrayPath = keyPath ? `${keyPath}.${key}[0]` : `${key}[0]`
        const itemClassName = classMapping[arrayPath] || generateClassName(key.replace(/s$/, ''))
        javaType = `List<${itemClassName}>`
      }

      fields.push({
        name: key,
        type: javaType
      })
    })

    // 生成简单的类代码
    const simpleCode = `public class ${className} {\n${fields.map(field => 
      `    private ${field.type} ${field.name};`
    ).join('\n')}\n}`

    return {
      className,
      fields,
      code: simpleCode
    }
  }
  
  // 递归生成所有类（去重版本）
  const generateAllClasses = (obj: any, keyName: string = '', parentPath: string = '') => {
    if (typeof obj !== 'object' || obj === null) return
    
    if (Array.isArray(obj)) {
      // 对于数组，只处理第一个元素来生成类，避免重复
      if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        const itemPath = `${parentPath}.${keyName}[0]`
        const itemClassName = classMapping[itemPath] || generateClassName(keyName.replace(/s$/, ''))
        
        // 检查是否已经处理过这个类名
        if (!generatedClasses.has(itemClassName)) {
          const itemClass = generateClass(obj[0], itemClassName, itemPath)
          
          if (itemClass && itemClass.code) {
            classes.push(itemClass)
            generatedClasses.add(itemClassName)
            generateAllClasses(obj[0], keyName, itemPath)
          }
        }
      }
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedPath = parentPath ? `${parentPath}.${key}` : key
          const nestedClassName = classMapping[nestedPath] || generateClassName(key)
          
          // 检查是否已经处理过这个类名
          if (!generatedClasses.has(nestedClassName)) {
            const nestedClass = generateClass(value, nestedClassName, nestedPath)
            
            if (nestedClass && nestedClass.code) {
              classes.push(nestedClass)
              generatedClasses.add(nestedClassName)
              generateAllClasses(value, key, nestedPath)
            }
          }
        } else if (Array.isArray(value)) {
          generateAllClasses(value, key, parentPath)
        }
      })
    }
  }
  
  // 生成所有子类
  generateAllClasses(parsedJson.value, 'root', '')
  
  // 生成主类
  const finalRootClassName = generateClassName(settings.value.rootClassName)
  const mainClass = generateClass(parsedJson.value, finalRootClassName, '')
  if (mainClass && mainClass.code && !generatedClasses.has(finalRootClassName)) {
    classes.unshift(mainClass) // 主类放在第一个
  }
  
  javaClasses.value = classes
}
</script>

<style scoped>
.json-to-java-converter {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* 确保过渡效果平滑 */
input {
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
}

/* 确保禁用状态的样式 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>