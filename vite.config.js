import { defineConfig } from "vite";
import { resolve } from "node:path";
import fg from "fast-glob";

const input = {
  main: resolve(import.meta.dirname, "index.html"),
  archive: resolve(import.meta.dirname, "archive.html"),
  about: resolve(import.meta.dirname, "about.html"),
};

const pages = fg.sync("**/*.html", {
  cwd: resolve(import.meta.dirname, "src/pages"),
  absolute: false,
});

for (const page of pages) {
  input[page.replace(/\.html$/, "").split("/").pop()] = resolve(
    import.meta.dirname,
    "src/pages",
    page,
  );
}

export default defineConfig({
  appType: "mpa",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    rolldownOptions: { input },
  },
});
