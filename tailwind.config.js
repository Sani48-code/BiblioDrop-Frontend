export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class", "[data-theme='bibliodark']"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bibliolight: {
          "primary": "#4F46E5",
          "primary-content": "#ffffff",
          "secondary": "#0EA5E9",
          "secondary-content": "#ffffff",
          "accent": "#F59E0B",
          "accent-content": "#000000",
          "neutral": "#1E293B",
          "base-100": "#FAFAF9",
          "base-200": "#F5F5F4",
          "base-300": "#E7E5E4",
          "base-content": "#1C1917",
          "info": "#38BDF8",
          "success": "#34D399",
          "warning": "#FBBF24",
          "error": "#F87171",
        },
        bibliodark: {
          "primary": "#818CF8",
          "primary-content": "#ffffff",
          "secondary": "#38BDF8",
          "secondary-content": "#000000",
          "accent": "#FBBF24",
          "accent-content": "#000000",
          "neutral": "#334155",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
          "base-content": "#E2E8F0",
          "info": "#38BDF8",
          "success": "#34D399",
          "warning": "#FBBF24",
          "error": "#F87171",
        },
      },
    ],
    defaultTheme: "bibliolight",
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
};
