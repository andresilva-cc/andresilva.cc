/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this directory. Without this, the dual
  // pnpm-lock.yaml (one here, one at the main repo root) makes Next infer
  // the workspace root as the main repo — whose .claude/ tree is ~8.5 GB —
  // and the dev watcher/tracer churns it, leaking memory until it crashes.
  // Note: `import.meta.dirname`, not `__dirname` (undefined in ESM .mjs).
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
