/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,

  // Generate standalone production output for deployment
  output: "standalone",

  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // Webpack configuration
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },
};

module.exports = nextConfig;
