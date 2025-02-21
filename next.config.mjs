/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    domains: ['images.unsplash.com', 'upload.wikimedia.org', 'https://via.placeholder.com/60'],
  },
};

export default nextConfig;
