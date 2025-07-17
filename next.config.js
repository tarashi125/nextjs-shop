/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["mongoose"],
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    webpack(config) {
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        }
        return config
    },
    i18n: {
        locales: ['en', 'vi'],
        defaultLocale: 'vi',
    }
};

module.exports = nextConfig
