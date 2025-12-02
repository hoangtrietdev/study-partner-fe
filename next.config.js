/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'localhost'],
  },
  // Removed API proxy - using Next.js API routes directly
};

module.exports = nextConfig;
