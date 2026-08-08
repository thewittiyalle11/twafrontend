/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@twa/shared', '@twa/api-client', '@twa/mock-data'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
