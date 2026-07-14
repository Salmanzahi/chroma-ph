import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export for fully client-side application.
  // Camera requires HTTPS in production; localhost works for dev.
  output: "export",
  // Disable image optimization for static export.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
