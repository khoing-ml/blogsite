/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true
  },
  /**
   * Enable static HTML export. We pre-generate search index + feeds.
   */
  output: 'export',
  images: { unoptimized: true }
};

// Optional basePath/assetPrefix for GitHub Pages project sites.
// Set NEXT_PUBLIC_BASE_PATH (e.g. /blogsite) in the build environment if needed.
if (process.env.NEXT_PUBLIC_BASE_PATH) {
  nextConfig.basePath = process.env.NEXT_PUBLIC_BASE_PATH;
  nextConfig.assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH;
}

export default nextConfig;
