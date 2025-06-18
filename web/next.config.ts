import type { NextConfig } from "next";
import { config } from "dotenv";

config({ path: ".env" });

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "workoscdn.com",
      },
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
    WORKOS_API_KEY: process.env.WORKOS_API_KEY,
    WORKOS_ORG_ID: process.env.WORKOS_ORG_ID,
    WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD,
    NEXT_PUBLIC_WORKOS_REDIRECT_URL: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URL,
  }
};

export default nextConfig;
