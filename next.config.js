/** @type {import('next').NextConfig} */
<<<<<<< Updated upstream
const nextConfig = {
  reactStrictMode: false,
};

module.exports = nextConfig;
=======
const nextConfig = {};

module.exports = nextConfig;

module.exports = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        return config;
    },
};
>>>>>>> Stashed changes
