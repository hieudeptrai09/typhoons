import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: "/names/current", destination: "/names?status=current", permanent: true },
      { source: "/names/retired", destination: "/names?status=retired", permanent: true },
      { source: "/names/history", destination: "/names?status=all", permanent: true },
      { source: "/names/filter", destination: "/names", permanent: true },
    ];
  },
};

export default nextConfig;
