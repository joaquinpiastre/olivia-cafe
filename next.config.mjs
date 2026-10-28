/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'], localPatterns: [{ pathname: '/img/**' }] },
  serverExternalPackages: ['sharp', 'exceljs', '@prisma/client', 'bcryptjs'],
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
