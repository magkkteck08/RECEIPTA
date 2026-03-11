import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development", // Disables PWA in dev mode
});

const nextConfig: NextConfig = {
  turbopack: {}, // Tells Next.js 16 to safely use Turbopack alongside our PWA
};

export default withSerwist(nextConfig);