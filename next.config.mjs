/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }] // required to make Konva & react-konva work
    return config
  },
  output: 'export',
}

export default nextConfig
