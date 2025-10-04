import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during builds (only for Docker/production builds)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript type checking during builds (only for Docker/production builds)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", 
      },
    ], 
  },
  // Fix for Server Actions with proxy/load balancer
  experimental: {
    serverActions: {
      allowedOrigins: ["98.70.24.108", "98.70.24.108:80", "localhost:3000"]
    }
  },
  // Handle forwarded headers correctly  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
