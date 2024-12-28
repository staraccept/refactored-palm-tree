/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'interfaces.zapier.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig