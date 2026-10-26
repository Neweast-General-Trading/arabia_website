import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "20.74.222.101",
    "http://20.74.222.101",
    "arabia.neweast.cloud",
    "https://arabia.neweast.cloud",
    "localhost:3020",
    "127.0.0.1:3020",
  ],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "arabia.neweast.cloud", pathname: "/uploads/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:locale/about/governance",
        destination: "/:locale/governance",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
