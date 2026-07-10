// When deployed on GitHub Pages as a project site, the app is served from
// https://<user>.github.io/<repo>/ instead of the domain root. Next.js's
// `basePath` config automatically prefixes routing and its own built assets,
// but it does NOT rewrite hardcoded strings like <img src="/logo.png">.
// This helper lets us prefix those manually, using the same env var that
// next.config.ts uses to set `basePath`.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
