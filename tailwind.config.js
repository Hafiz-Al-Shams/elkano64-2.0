/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        script: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    logs: false,
    darkTheme: "elkanoDark",
    themes: [
      {
        elkanoLight: {
          primary: "#B5452B",
          "primary-content": "#FFFFFF",
          secondary: "#2F5A43",
          "secondary-content": "#FFFFFF",
          accent: "#E8A33D",
          "accent-content": "#2B2118",
          neutral: "#1F3A2B",
          "neutral-content": "#F4EEE2",
          "base-100": "#FBF7F0",
          "base-200": "#F4EEE2",
          "base-300": "#E9E0CF",
          "base-content": "#2B2118",
          info: "#3B82F6",
          success: "#2F8F5B",
          warning: "#E8A33D",
          error: "#D1432F",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
        },
      },
      {
        elkanoDark: {
          primary: "#D0603F",
          "primary-content": "#FFFFFF",
          secondary: "#3F7A5A",
          "secondary-content": "#FFFFFF",
          accent: "#E8A33D",
          "accent-content": "#1A1410",
          neutral: "#0B130F",
          "neutral-content": "#EDE6D8",
          "base-100": "#14201A",
          "base-200": "#101A15",
          "base-300": "#0B120E",
          "base-content": "#EDE6D8",
          info: "#60A5FA",
          success: "#34A56F",
          warning: "#E8A33D",
          error: "#E5614A",
          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
        },
      },
    ],
  },
}