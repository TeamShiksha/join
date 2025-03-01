import next from 'next';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], 
  },
};

export default nextConfig;
