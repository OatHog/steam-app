/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.steamstatic.com",
      },
      {
        protocol: "http",
        hostname: "media.steampowered.com",
        port: "",
        pathname: "/steamcommunity/public/images/apps/**",
      },
    ],
  },
};

export default nextConfig;
