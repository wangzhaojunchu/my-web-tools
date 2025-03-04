import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,  // 启用 React 严格模式，帮助发现潜在问题
  experimental: {
    serverComponentsExternalPackages: ["geoip-lite", "baidu","fs"], // 允许 `geoip-lite` 作为外部包在 Server Components 中使用
  },
  /** @type {import('next').NextConfig} */
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("canvas"); // 让 Next.js 在服务器端不打包 `canvas`
    }
    return config;
  },

};

export default nextConfig;
