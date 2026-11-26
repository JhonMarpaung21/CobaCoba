import type { NextConfig } from "next";

const pagesBasePath = process.env.SPORTID_PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(pagesBasePath !== undefined && {
    basePath: pagesBasePath,
    output: "export",
    trailingSlash: true,
  }),
};

export default nextConfig;
