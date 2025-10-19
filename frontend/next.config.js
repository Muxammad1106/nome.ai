/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en/dashboard',
        permanent: true,
      },
      {
        source: '/en',
        destination: '/en/dashboard',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['nome-ai-t5lly.ondigitalocean.app'],
  },
}

module.exports = nextConfig
