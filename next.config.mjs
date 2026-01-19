/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tree-shake framer-motion barrel imports for faster cold starts
    // This transforms `import { motion } from 'framer-motion'` to direct imports
    optimizePackageImports: ['framer-motion'],
  },
};

export default nextConfig;
