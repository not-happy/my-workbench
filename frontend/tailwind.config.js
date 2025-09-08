/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  darkMode: 'class', // 启用基于class的dark mode
  theme: {
    extend: {
      // 扩展颜色配置以支持更好的dark mode
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6', 
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        }
      }
    },
  },
  plugins: [],
}
