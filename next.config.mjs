/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // <=== Enables static export
  
  // Optional: Disable image optimization if you are not using an external loader
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;