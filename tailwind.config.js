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
          "secondary": "#06B6D4",
          "secondary-content": "#ffffff",
          "accent": "#F59E0B",
          "accent-content": "#ffffff",
          "neutral": "#1e293b",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          "base-content": "#1e293b",
        },
        bibliodark: {
          "primary": "#6366F1",
          "primary-content": "#ffffff",
          "secondary": "#22D3EE",
          "secondary-content": "#ffffff",
          "accent": "#FBBF24",
          "accent-content": "#000000",
          "neutral": "#334155",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#e2e8f0",
        },
      },
    ],
    defaultTheme: "bibliolight",
  },
};
