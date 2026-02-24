import type { NextConfig } from "next";

const nextConfig = {
  serverExternalPackages: ["chromadb", "@chroma-core/default-embed"],
};

export default nextConfig;
