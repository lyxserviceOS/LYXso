import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// ✅ WEEK 2 OPTIMIZATION: Frontend bundle optimization
const nextConfig: NextConfig = {
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // Split chunks for better caching
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common components chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@supabase/supabase-js', 'lucide-react'],
  },

  // Production source maps (smaller)
  productionBrowserSourceMaps: false,

  // Compression
  compress: true,

  // Strict mode for better optimization
  reactStrictMode: true,

  // Redirects for webshop consistency
  async redirects() {
    return [
      // Redirect old butikk URLs to shop
      {
        source: '/butikk',
        destination: '/shop',
        permanent: true, // 301 redirect
      },
      {
        source: '/butikk/:path*',
        destination: '/shop/:path*',
        permanent: true,
      },
      // Redirect cart aliases
      {
        source: '/handlekurv',
        destination: '/shop/cart',
        permanent: true,
      },
      {
        source: '/kasse',
        destination: '/shop/checkout',
        permanent: true,
      },
    ];
  },
};

// Wrap with Sentry config
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Webpack configuration
  webpack: {
    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },
    
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
});
