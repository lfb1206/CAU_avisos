/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client'],
  typescript: {
    // Type errors in legacy form components (JS→TS migration in progress)
    // are caught by tsc --noEmit in CI; they don't block production builds.
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;