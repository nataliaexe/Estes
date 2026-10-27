import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The TypeScript CLI subprocess returns empty stdout in this runtime; use
  // the compiler API for Next's production build type checks.
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
