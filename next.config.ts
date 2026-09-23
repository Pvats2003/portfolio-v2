import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Old-site URLs that may already be shared (e.g. on LinkedIn) point at the new flagship story.
  async redirects() {
    return [
      { source: '/work/instawork', destination: '/work/city-ops-os', permanent: true },
      { source: '/work/opsintel', destination: '/work/city-ops-os', permanent: true },
    ];
  },
};

export default nextConfig;
