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
    // Needed for the local SVG placeholder used when gear has no valid image URL.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
