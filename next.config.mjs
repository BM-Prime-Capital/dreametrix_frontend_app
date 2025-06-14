/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    domains: ['images.unsplash.com', 'upload.wikimedia.org', 'via.placeholder.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' 
              ? '*' // Autoriser toutes les origines en développement
              : 'https://dreametrix-app.com/' // Restreindre en production
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ],
      },
    ];
  },
};

export default nextConfig;