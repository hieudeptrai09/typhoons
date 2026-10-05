import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  env: {
    // Inlined at build time so ISR re-renders between deploys produce identical output.
    BUILD_YEAR: String(new Date().getFullYear()),
  },
};

export default nextConfig;
