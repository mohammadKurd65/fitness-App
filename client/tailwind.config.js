/** @type {import('tailwindcss').Config} */
import { defineConfig } from 'tailwindcss/helpers'

export default defineConfig({
content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
],
theme: {
    extend: {},
},
plugins: [],
})
