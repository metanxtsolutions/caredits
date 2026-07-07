import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Capped low: static generation runs one Prisma-backed page per worker
  // concurrently, and Supabase's session pooler caps at 15 connections.
  experimental: {
    cpus: 4,
  },
};

export default nextConfig;
