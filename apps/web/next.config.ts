import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@intra/shared-kernel'],
};

export default nextConfig;
