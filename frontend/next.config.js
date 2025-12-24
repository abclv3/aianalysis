/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/audio/:path*',
                destination: 'http://localhost:3001/audio/:path*',
            },
        ];
    },
}

module.exports = nextConfig
