import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{js,ts,tsx}"],
    exclude: ["node_modules", "dist", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/__tests__/**",
        "**/dist/**",
        "**/.next/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@repo/ai": path.resolve(__dirname, "./packages/ai/src"),
      "@repo/supabase": path.resolve(__dirname, "./packages/supabase/src"),
      "@": path.resolve(__dirname, "./apps/web"),
    },
  },
});

