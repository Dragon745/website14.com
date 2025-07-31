/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./*.html",
        "./js/**/*.js",
        "./admin/**/*.html",
        "./admin/**/*.js"
    ],
    theme: {
        extend: {
            fontFamily: {
                jetbrains: ["JetBrains Mono", "monospace"],
                inter: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}