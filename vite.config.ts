// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Self-deploy target. By default (outside Lovable) Nitro is off and you get a
  // Vite-only build with no server — which breaks SSR + server functions. On
  // Vercel (process.env.VERCEL=1) we force Nitro on with the Vercel preset so the
  // build emits a proper serverless output. Local dev/build is untouched:
  // process.env.VERCEL is undefined there → nitro stays at its default.
  nitro: process.env.VERCEL ? { preset: "vercel" } : undefined,
});
