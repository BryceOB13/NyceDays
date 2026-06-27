/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours — images are static assets
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'zrbmptifkuelqemzmxbm.supabase.co',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Short link-in-bio alias for the casting form.
      { source: '/apply', destination: '/casting', permanent: false },
    ]
  },
};

export default nextConfig;
