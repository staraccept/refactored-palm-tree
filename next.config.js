/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { runtime: 'nodejs' }, // ✅ Forces API to use Node.js runtime instead of Edge
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
