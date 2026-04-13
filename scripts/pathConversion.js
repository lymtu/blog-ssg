import fs from "fs/promises";
import path from "path";
import readline from "readline/promises";

const root = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pathConversion = async (config = {}) => {
  const {
    outputDir = "dist",
    filesPath = "src/pages",
    removeDir = "src",
  } = config;

  const outputDirAbs = path.join(root, outputDir);

  await fs.cp(path.join(outputDirAbs, filesPath), outputDirAbs, {
    recursive: true,
  });

  const rmDirPath = path.join(outputDirAbs, removeDir);
  const answer = await rl.question(
    `是否删除构建历史目录: "${rmDirPath}" ? (y/n) `,
  );
  rl.close();

  if (answer === "y") {
    await fs.rm(rmDirPath, { recursive: true, force: true });
    console.log(`已删除 ${rmDirPath}。`);
  }
};

export default pathConversion;
