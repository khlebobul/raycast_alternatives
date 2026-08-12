import type { NextConfig } from "next";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath =
  process.env.BASE_PATH ??
  (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}` : "");

const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  allowedDevOrigins: ["127.0.0.1"],
};

export default config;
