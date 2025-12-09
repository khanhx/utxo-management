/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Uncomment and set basePath if deploying to a subdirectory (e.g., username.github.io/repo-name)
  // basePath: '/utxo-management',
  // assetPrefix: '/utxo-management',
}

module.exports = nextConfig
