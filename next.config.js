/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      //Remove: runtime: 'nodejs', // ✅ Remove this line.
  },
  output: 'export', // ✅ Add this line.  This is the key fix.

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;