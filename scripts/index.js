import md2html from "./mdTransform.js";
import mkJson from "./mkJson.js";
import insertHtml from "./insert.js";
import { exec } from "child_process";
import pathConversion from "./pathConversion.js";

console.log("开始转换md文件...");
md2html({
  mdDir: "src/markdown", // md文件所在目录
  outputDir: "src/pages", // 输出目录
  template: "template.html", // 模板文件
  templatePlaceholder: {
    // 模板占位符
    title: "{{title}}",
    content: "{{content}}",
  },
})
  .then(async (mdInfoList) => {
    console.log("转换完成，开始生成json信息文件...");

    mdInfoList.sort((a, b) => b.birthTime - a.birthTime);

    await mkJson(mdInfoList, ["src", "assets"], "mdInfo.json");
    console.log("json信息文件生成完成，开始build...");
    return mdInfoList;
  })
  .then(
    (mdInfoList) =>
      new Promise((resolve, reject) => {
        exec("npx vite build", (err, stdout, stderr) => {
          if (err) {
            console.error(stderr);
            reject(err);
            return;
          }
          console.log(stdout);
          console.log("build完成，开始插入html...");
          resolve(mdInfoList);
        });
      }),
  )
  .then(insertHtml)
  .then(async () => {
    console.log("插入完成，开始路径转换...");
    await pathConversion("dist/src/pages");
    console.log("路径转换完成。");
  })
  .finally(() => {
    console.log("构建完成!");
  })
  .catch((err) => {
    console.error(err);
  });
