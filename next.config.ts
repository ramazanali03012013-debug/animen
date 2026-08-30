import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.jikan.moe" },
      { protocol: "https", hostname: "cdn.myanimelist.net" },
      { protocol: "https", hostname: "uploads.mangadex.org" },
      { protocol: "https", hostname: "*.mangadex.org" },
      { protocol: "https", hostname: "images.weserv.nl" },
    ],
  },
};

export default nextConfig;
