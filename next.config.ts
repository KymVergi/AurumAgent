import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.polymarket.com" },
      { protocol: "https", hostname: "**.finnhub.io" },
    ],
  },

};

export default nextConfig;
