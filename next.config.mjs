/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/dogeol.github.io/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/dogeol.github.io' : '',
};

export default nextConfig;
