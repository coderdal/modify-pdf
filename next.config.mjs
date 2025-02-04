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

        config.resolve.fallback = {
            ...config.resolve.fallback,
            "Promise.withResolvers": false
        };

        return config;
    },
    output: 'standalone'
};

export default nextConfig;
