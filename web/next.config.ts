import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Keep Node-only DB drivers out of the instrumentation/webpack graph (local PGlite + Tiger pg).
  serverExternalPackages: ["pg", "pg-connection-string", "@electric-sql/pglite"],
};

export default nextConfig;
