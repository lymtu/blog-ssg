import fs from "fs/promises";
import path from "path";

const root = process.cwd();
const mkJson = async (json, dirList, jsonName) => {
  const dir = path.join(root, ...dirList);
  const newJson = JSON.stringify(json, null, 2);
  await fs.writeFile(path.join(dir, jsonName), newJson, "utf-8");
};

export default mkJson;
