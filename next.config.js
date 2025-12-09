/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Disable Turbopack for production builds (CI/CD compatibility)
  ...(process.env.NODE_ENV === 'production' && {
    experimental: {
      turbo: false,
    },
  }),
  // Uncomment and set basePath if deploying to a subdirectory (e.g., username.github.io/repo-name)
  // basePath: '/utxo-management',
  // assetPrefix: '/utxo-management',
}

module.exports = nextConfig
