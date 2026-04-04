/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F1F5F9',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
        status: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
        }
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      borderRadius: {
        DEFAULT: '8px',
        'lg': '12px',
      }
    },
  },
  plugins: [],
}
