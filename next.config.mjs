import webpack from 'webpack';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path'; // Added resolve import

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
              ? '*' 
              : 'https://dreametrix-app.com/'
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

  webpack(config, { isServer }) {
    const { IgnorePlugin, ContextReplacementPlugin } = webpack;

        // Add Handlebars alias to use the runtime-only version
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: 'handlebars/dist/handlebars.runtime.js'
    };

    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      module: false,
      inspector: false,
    };

    // Ignore problematic modules
    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new IgnorePlugin({
        resourceRegExp: /^require-in-the-middle$/,
      })
    );

    // Only apply OpenTelemetry config on server side
    if (isServer) {
      config.plugins.push(
        new ContextReplacementPlugin(
          /@opentelemetry/,
          resolve(__dirname, 'node_modules/@opentelemetry') // Using resolve instead of path.resolve
        )
      );
    }

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/sdk-node': false,
        '@genkit-ai/core': false,
        'genkit': false
      };
    }

    return config;
  },
};

export default nextConfig;