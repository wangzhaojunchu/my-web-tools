import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,  // 启用 React 严格模式，帮助发现潜在问题
  experimental: {
    serverComponentsExternalPackages: ["geoip-lite"], // 允许 `geoip-lite` 作为外部包在 Server Components 中使用
  },
};

export default nextConfig;
