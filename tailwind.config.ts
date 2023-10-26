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
                'exit-mark': '#fd2f79',
                'chat-selected': '#4d49e7',
            },
            backgroundImage: {
                'custom-gradient':
                    'linear-gradient(180deg, rgba(203,23,249,1) 0%, rgba(238,154,188,1) 65%)',
                'sendbtn-gradient':
                    'linear-gradient(329deg, rgba(34,30,208,1) 26%, rgba(129,48,209,1) 54%, rgba(177,52,171,1) 83%)',
                'main-background':
                    'linear-gradient(146deg, rgba(237, 101, 231, 0.56) 16.83%, rgba(190, 142, 237, 0.47) 53.75%, rgba(140, 138, 255, 0.38) 89.83%);',
            },
        },
    },
    plugins: [require('tailwind-scrollbar-hide')],
};
export default config;
