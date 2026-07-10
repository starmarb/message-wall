import type { NextConfig } from "next";

// Set by the GitHub Actions workflow to "/<repo-name>" for project pages
// (e.g. https://username.github.io/repo-name/). Leave unset for a user/org
// page (username.github.io) or local dev, where the app is served from "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Produces a fully static site in ./out — no Node server needed, so it can
  // be hosted on GitHub Pages.
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // next/image's optimization API needs a server; disable it for static export.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
