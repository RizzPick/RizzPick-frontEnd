import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'gradient-start': '#cb17f9',
                'gradient-end': '#ee9abc',
            },
            backgroundImage: {
                'custom-gradient': 'linear-gradient(180deg, rgba(203,23,249,1) 0%, rgba(238,154,188,1) 65%)'
            }
        },
    },
    plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
