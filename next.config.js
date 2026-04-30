/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // Build will skip linting entirely (no warning)
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false, // ✅ Fix for pdfjs-dist error
    };
    return config;
  },
};

module.exports = nextConfig;
