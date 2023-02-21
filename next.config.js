/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: false },
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
};

module.exports = nextConfig;
