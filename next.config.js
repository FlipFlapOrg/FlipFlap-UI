/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['flipflap-server.trap.games'],
  },
}

module.exports = nextConfig
