import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },

  // Environment variables should be in .env files, not here
  // These values are moved to .env.local

  // Configure webpack for sharp module
  webpack: (config) => {
    config.externals = [...config.externals, 'sharp'];
    return config;
  },
};

export default nextConfig;
