import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
      },
      // in case other coingecko assets are used in the future
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
    ],
  },
};

export default nextConfig;
