/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/utxo-management',
  assetPrefix: '/utxo-management',
}

module.exports = nextConfig
