import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Gear images are provider-supplied URLs (seed data even ships bare
    // filenames like "bike1.jpg" that aren't resolvable at all). We fall
    // back to a local placeholder for anything that isn't an absolute
    // http(s) URL, but for real ones we accept any host since providers
    // can host images anywhere.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
