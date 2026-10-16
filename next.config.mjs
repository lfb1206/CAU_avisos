/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client'],
  // The JS→TS migration these used to wait out is complete (no more @ts-nocheck
  // anywhere in src/, and eslint.config.mjs now actually parses TypeScript) —
  // type and lint errors now fail `next build` directly, so a plain `next build`
  // (e.g. Vercel's default build command) can no longer silently ship one.
};

export default nextConfig;