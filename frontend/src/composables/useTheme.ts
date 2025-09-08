import { ref, readonly, onMounted, watch } from 'vue'

export type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  // 初始化主题
  const initTheme = () => {
    // 优先从localStorage读取用户设置
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      // 如果没有保存的设置，使用系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    
    applyTheme()
  }

  // 应用主题到DOM
  const applyTheme = () => {
    const html = document.documentElement
    
    if (theme.value === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // 设置指定主题
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  // 监听主题变化，保存到localStorage并应用到DOM
  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    applyTheme()
  })

  // 监听系统主题变化
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有用户手动设置时才跟随系统
      if (!localStorage.getItem('theme')) {
        theme.value = e.matches ? 'dark' : 'light'
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  onMounted(() => {
    initTheme()
    watchSystemTheme()
  })

  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
    initTheme
  }
}
