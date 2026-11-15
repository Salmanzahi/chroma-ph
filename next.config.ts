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
  // Allow ngrok tunnels and local development origins for HMR and dev assets
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok.app",
    "*.ngrok.io",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
