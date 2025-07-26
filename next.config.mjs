/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.strapi.io',
        pathname: '/**',
      }
    ],
  }
};

export default nextConfig;
