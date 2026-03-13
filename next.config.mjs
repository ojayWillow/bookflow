/** @type {import('next').NextConfig} */
const nextConfig = {
  // Increase body size limit for image uploads (default is 4.5mb)
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
}

export default nextConfig
