
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // eslint configuration in next.config.ts is no longer supported in Next 16; comment out to avoid invalid config warning
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // experimental.turbo is an invalid key in Next 16; Turbopack config should not be set here
  // experimental: {
  //   turbo: {
  //     // Turbopack specific configuration (removed for Next 16)
  //   },
  // },
  async rewrites() {
    // Only apply dev-time rewrites; avoid proxying in production
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }
    return [
      {
        source: '/api/flow/:path*',
        destination: 'http://localhost:3400/api/flow/:path*', // Proxy to Genkit dev server
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Use canvas mock to prevent build issues
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: require.resolve('./canvas-mock.js'),
    };
    
    // Fallback for Node.js modules in client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: require.resolve('./canvas-mock.js'),
        fs: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    // Suppresses source map uploading logs during build
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
});
