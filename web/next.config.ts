import path from "node:path";
import type { NextConfig } from "next";

// eval("require")("pg") was invisible to NFT. Keep the closure listed so a
// serverless function can still resolve the driver if the tracer misses it.
const pgTrace = [
  "./node_modules/pg/**/*",
  "./node_modules/pg-pool/**/*",
  "./node_modules/pg-protocol/**/*",
  "./node_modules/pg-types/**/*",
  "./node_modules/pg-int8/**/*",
  "./node_modules/pg-connection-string/**/*",
  "./node_modules/pgpass/**/*",
  "./node_modules/split2/**/*",
  "./node_modules/postgres-array/**/*",
  "./node_modules/postgres-bytea/**/*",
  "./node_modules/postgres-date/**/*",
  "./node_modules/postgres-interval/**/*",
  "./node_modules/xtend/**/*",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Keep Node-only DB drivers out of the instrumentation/webpack graph (local PGlite + Tiger pg).
  serverExternalPackages: ["pg", "pg-connection-string", "@electric-sql/pglite"],
  outputFileTracingIncludes: {
    "/api/**/*": pgTrace,
  },
};

export default nextConfig;
