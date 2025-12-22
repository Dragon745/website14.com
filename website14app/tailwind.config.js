/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans Pro", "sans-serif"],
        heading: ["Inter Display", "sans-serif"],
        subheading: ["Work Sans", "sans-serif"],
        body: ["Source Sans Pro", "sans-serif"],
        logo: ["Bodoni Moda", "serif"],
        jetbrains: ["JetBrains Mono", "monospace"],
        // Keep inter for backward compatibility
        inter: ["Source Sans Pro", "sans-serif"],
      },
    },
  },
  plugins: [],
} 