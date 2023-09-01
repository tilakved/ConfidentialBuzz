import {themeColors} from "./src/assets/theme/themeColors.ts";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
        extend: {
            colors: themeColors,
            opacity: {
                highlight: '.10'
            }
        },
    },
    plugins: [],
};

