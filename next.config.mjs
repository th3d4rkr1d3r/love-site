/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: process.env.R2_PUBLIC_HOST
      ? [
          {
            protocol: "https",
            hostname: process.env.R2_PUBLIC_HOST,
          },
        ]
      : [],
  },
};

export default nextConfig;
