/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
      },
      {
        protocol: 'https',
        hostname: '*.traefik.me',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '*.traefik.me',
        pathname: '/uploads/**',
      },
    ],
  }
};

export default nextConfig;
