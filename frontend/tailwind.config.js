/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#06061a',
          surface: '#0d0d2b',
          card: '#12123a',
          border: '#1e1e5a',
          primary: '#7c3aed',
          'primary-light': '#9d5cf7',
          'primary-dark': '#5b21b6',
          accent: '#06b6d4',
          'accent-light': '#22d3ee',
          gold: '#f59e0b',
          'gold-light': '#fbbf24',
          success: '#10b981',
          danger: '#ef4444',
          muted: '#4a4a8a',
          text: '#e2e8f0',
          'text-muted': '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'stream': 'stream 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 5px #7c3aed, 0 0 10px #7c3aed' },
          to: { boxShadow: '0 0 20px #7c3aed, 0 0 40px #7c3aed, 0 0 60px #7c3aed' },
        },
        stream: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'forge-gradient': 'linear-gradient(135deg, #06061a 0%, #0d0d2b 50%, #12123a 100%)',
        'primary-gradient': 'linear-gradient(135deg, #7c3aed, #06b6d4)',
        'gold-gradient': 'linear-gradient(135deg, #f59e0b, #ef4444)',
      },
    },
  },
  plugins: [],
};
