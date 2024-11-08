/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ["mongoose"], // Updated key
  },
  images: {
    domains: ["lh3.googleusercontent.com"], // Allowed image domains
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true, // Enable top-level await support
    };
    return config;
  },
};

export default nextConfig;
