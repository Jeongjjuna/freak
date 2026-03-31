import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  ...(isProd ? { output: 'export' } : {}),
  basePath: '/freak',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    if (isProd) return [];
    return [
      {
        source: '/',
        destination: '/freak/',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
