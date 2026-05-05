import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@intra/shared-kernel'],
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
