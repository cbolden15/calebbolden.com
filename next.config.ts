import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/workflows',
        destination: '/#services',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
