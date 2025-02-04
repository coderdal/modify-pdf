/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        esmExternals: true
    },
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: "canvas" }];

        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        });

        return config;
    },
    output: 'standalone',
    runtime: 'nodejs',
    generateStaticParams: async () => {
        return {
            '/extract-pdf-text': { dynamic: true }
        }
    }
};

export default nextConfig;
