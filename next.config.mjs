import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
              : 'https://dreametrix-app.com/',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  webpack(config, { isServer, webpack }) {
    const { IgnorePlugin, ContextReplacementPlugin } = webpack

    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: 'handlebars/dist/handlebars.runtime.js',
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      module: false,
      inspector: false,
    }

    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
      new IgnorePlugin({
        resourceRegExp: /^require-in-the-middle$/,
      })
    )

    if (isServer) {
      config.plugins.push(
        new ContextReplacementPlugin(
          /@opentelemetry/,
          resolve(__dirname, 'node_modules/@opentelemetry')
        )
      )
    }

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/sdk-node': false,
        '@genkit-ai/core': false,
        'genkit': false,
      }
    }

    return config
  },
}

export default nextConfig
