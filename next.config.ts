import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        // Public URL of the mayor-k-images R2 bucket, and only that one: a `**.r2.dev`
        // wildcard let anyone feed images from their own bucket to /_next/image
        // (GHSA-2xp9-vwfh-vxw4). Keep in sync with the Cloudflare WAF rule
        // «Landing: solo imágenes propias».
        protocol: 'https',
        hostname: 'pub-1c0300ef326148a28d6e53430acf01fd.r2.dev',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
