import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // /world test override (?world=force, ?shot=…) works everywhere except Vercel production.
  env: { NEXT_PUBLIC_WORLD_TEST: process.env.VERCEL_ENV === 'production' ? '0' : '1' },
  // Screenshots are served as AVIF (or WebP where AVIF isn't supported), resized per device.
  images: { formats: ['image/avif', 'image/webp'], qualities: [75] },
  // Old-site URLs that may already be shared (e.g. on LinkedIn) point at the new flagship story.
  async redirects() {
    return [
      { source: '/work/instawork', destination: '/work/city-ops-os', permanent: true },
      { source: '/work/opsintel', destination: '/work/city-ops-os', permanent: true },
    ];
  },
};

export default nextConfig;
