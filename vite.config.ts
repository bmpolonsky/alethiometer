import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  const runtime = globalThis as typeof globalThis & {
    process?: {
      env?: Record<string, string | undefined>;
    };
  };
  const repositoryName = runtime.process?.env?.GITHUB_REPOSITORY?.split("/")[1];
  const base =
    runtime.process?.env?.GITHUB_ACTIONS === "true" && repositoryName
      ? `/${repositoryName}/`
      : "/";

  return {
    base,
    plugins: [react()],
    server: {
      host: "0.0.0.0",
    },
  };
});
