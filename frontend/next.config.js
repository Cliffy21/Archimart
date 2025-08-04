/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'components');
    return config;
  },
};

module.exports = nextConfig;