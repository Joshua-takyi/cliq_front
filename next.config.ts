import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        // google auth image
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        // github auth image
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },
  // Ensure API routes work properly with external requests
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          // Allow requests from any origin
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          // Allow specific HTTP methods
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          // Allow specific headers
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-Requested-With, Content-Type, Accept, Authorization, x-paystack-signature",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
