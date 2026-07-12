import createMDX from '@next/mdx'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

const basePageExtensions = ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx']
const withMDX = createMDX()

const nextConfig = (phase) =>
  withMDX({
    output: 'export',
    pageExtensions:
      phase === PHASE_DEVELOPMENT_SERVER ? ['dev.tsx', ...basePageExtensions] : basePageExtensions,
    turbopack: {
      root: import.meta.dirname,
    },
  })

export default nextConfig
