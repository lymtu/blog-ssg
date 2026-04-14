import { exec } from "child_process";
import insertHtml from "./insert.js";
import pathConversion from "./pathConversion.js";
import mdInfoList from "../../src/assets/mdInfo.json"with { type: 'json' };

new Promise((resolve, reject) => {
  exec("npx vite build", (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      reject(err);
      return;
    }
    console.log(stdout);
    console.log("build完成，开始插入html...");
    resolve();
  });
})
  .then(() => insertHtml(mdInfoList))
  .then(async () => {
    console.log("插入完成，开始路径转换...");
    await pathConversion({
      outputDir: "dist",
      filesPath: "src/pages",
      removeDir: "src",
    });
    console.log("路径转换完成。");
    console.log("build完成!");
  })
  .catch((err) => {
    console.error(err);
  });
