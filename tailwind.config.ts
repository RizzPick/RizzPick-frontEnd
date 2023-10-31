import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        screens: {
            sm: { min: '0px', max: '392px' },
            md: { min: '392px', max: '1023px' },
            lg: { min: '1080px' },
        },
        extend: {
            colors: {
                'gradient-start': '#cb17f9',
                'gradient-end': '#ee9abc',
                'exit-mark': '#fd2f79',
                'chat-selected': '#4d49e7',
                'button-bg':
                    'var(--fill-pur-6949-e-7, rgba(105, 73, 231, 0.67))',
                'border-solid': 'var(--fill-d-67-dff, #D67DFF)',
                'myplan-button': 'var(--fill-pur-cb-17-f-9, #CB17F9);',
                'activityDelete-button': 'var(--fill-pur-c-242-ff, #C242FF)',
            },
            backgroundImage: {
                'custom-gradient':
                    'linear-gradient(180deg, rgba(203,23,249,1) 0%, rgba(238,154,188,1) 65%)',
                'sendbtn-gradient':
                    'linear-gradient(329deg, rgba(34,30,208,1) 26%, rgba(129,48,209,1) 54%, rgba(177,52,171,1) 83%)',
                'main-background':
                    'linear-gradient(146deg, rgba(237, 101, 231, 0.56) 16.83%, rgba(190, 142, 237, 0.47) 53.75%, rgba(140, 138, 255, 0.38) 89.83%);',
                'profile-gradient':
                    'linear-gradient(146deg, rgba(236.94, 100.70, 231.49, 0.41) 0%, rgba(189.55, 142.16, 236.94, 0.35) 51%, rgba(140.46, 138.13, 255, 0.28) 100%);',
                'profile-border-gradient':
                    'linear-gradient(146deg, rgba(200.81, 41, 194.42, 0.75) 0%, rgba(128.64, 47.97, 209.31, 0.62) 51%, rgba(33.93, 30.37, 208.25, 0.50) 100%)',
                'board-bg':
                    'linear-gradient(146deg, rgba(255, 185, 252, 0.17) 16.83%, rgba(176, 97, 255, 0.14) 53.75%, rgba(50, 46, 255, 0.11) 89.83%);',
                'write-bg':
                    'linear-gradient(146deg, rgba(237, 101, 231, 0.66) 16.83%, rgba(190, 142, 237, 0.55) 53.75%, rgba(140, 138, 255, 0.45) 89.83%);',
            },
        },
    },
    plugins: [require('tailwind-scrollbar-hide')],
};
export default config;
