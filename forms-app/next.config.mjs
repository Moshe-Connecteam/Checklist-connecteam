/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization config for Netlify
  images: {
    unoptimized: true,
    domains: ['localhost']
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack config for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },

  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Enable compression
  compress: true,
  
  // Async redirects for friendly URLs
  async redirects() {
    return []
  },
  
  async rewrites() {
    return [
      {
        source: '/forms/:slug',
        destination: '/forms/[slug]',
      },
      {
        source: '/forms/:slug/responses',
        destination: '/forms/[slug]/responses',
      }
    ]
  }
}

export default nextConfig
