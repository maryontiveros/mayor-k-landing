import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public URLs (mayor-k-images bucket)
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        // Custom R2 domain if configured
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
}

export default nextConfig
