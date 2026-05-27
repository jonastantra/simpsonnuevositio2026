const fs = require("fs");
const path = require("path");

const root = process.cwd();
const source = path.join(root, ".next", "routes-manifest.json");
const target = path.join(root, "out", "routes-manifest.json");

if (fs.existsSync(source) && fs.existsSync(path.dirname(target))) {
  fs.copyFileSync(source, target);
}
