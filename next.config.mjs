import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Pin tracing root to this repo so an unrelated package-lock.json
  // elsewhere on the dev box doesn't get picked up as the workspace root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
