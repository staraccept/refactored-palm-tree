import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'interfaces.zapier.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;