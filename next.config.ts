import type { NextConfig } from "next";

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

  // SWC minification (faster than Terser)
  swcMinify: true,

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

export default nextConfig;
