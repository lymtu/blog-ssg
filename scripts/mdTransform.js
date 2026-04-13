import fs from "fs/promises";
import path from "path";
import fg from "fast-glob";
import { marked } from "marked";

const defaultConfig = {
  mdDir: "src/markdown",
  outputDir: "src/pages",
  template: "template.html",
  templatePlaceholder: {
    title: "{{title}}",
    content: "{{content}}",
  },
};

const root = process.cwd();

const md2html = async (config = {}) => {
  config = {
    ...defaultConfig,
    ...config,
  };

  const mdFileList = await fg("**/*.md", {
    cwd: path.join(root, config.mdDir),
    absolute: false,
  });
  const mdInfoList = [];

  for (const mdPath of mdFileList) {
    const baseName = path.basename(mdPath, ".md");
    const type = mdPath.split("/" + baseName)[0];
    const stat = await fs.stat(path.join(root, config.mdDir, mdPath));
    mdInfoList.push({
      baseName,
      type,
      birthTime: Math.ceil(stat.birthtimeMs),
      ctimeMs: Math.ceil(stat.ctimeMs),
    });
  }

  const mdTransformer = async (mdPath) => {
    const mdContent = await fs.readFile(
      path.join(root, config.mdDir, mdPath),
      "utf-8",
    );
    return marked.parse(mdContent);
  };

  const htmlTemplate = await fs.readFile(
    path.join(root, config.template),
    "utf-8",
  );

  for (const info of mdInfoList) {
    const htmlContent = await mdTransformer(
      path.join(info.type, info.baseName + ".md"),
    );
    const html = htmlTemplate
      .replace(config.templatePlaceholder.title, info.baseName)
      .replace(config.templatePlaceholder.content, htmlContent);

    const fileDir = path.join(root, config.outputDir, info.type);

    try {
      await fs.access(fileDir);
    } catch (error) {
      await fs.mkdir(fileDir, {
        recursive: true,
      });
    }

    await fs.writeFile(
      path.join(root, config.outputDir, info.type, info.baseName + ".html"),
      html,
    );
  }

  return mdInfoList;
};

export default md2html;
