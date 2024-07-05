/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: ['mytheme','synthwave'],
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#38B6FF",

          "secondary": "#FFDE59",

          "accent": "#111928",

          "neutral": "#111928",

          "base-100": "#1f2937",

          "info": "#0ea5e9",

          "success": "#00ff00",

          "warning": "#facc15",

          "error": "#ff0000",
        },
      },
    ],
  },
}

