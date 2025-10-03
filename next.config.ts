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
};

export default nextConfig;
