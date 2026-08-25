"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".html"));
const manifestPath = path.join(root, "assets", "waifu", "v1", "model-manifest.json");
const tipsPath = path.join(root, "assets", "waifu", "v1", "waifu-tips.json");
const scriptPath = path.join(root, "js", "waifu-pet.js");
const stylePath = path.join(root, "css", "waifu.css");
const errors = [];

function requireFile(file) {
  if (!fs.existsSync(file)) errors.push(`missing: ${path.relative(root, file)}`);
}

requireFile(manifestPath);
requireFile(tipsPath);
requireFile(scriptPath);
requireFile(stylePath);

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.format !== "static-image" || manifest.live2d !== false) {
  errors.push("manifest must explicitly identify the asset as a non-Live2D static image");
}
if (/model3?\.json|\.moc3?$/i.test(manifest.entry || "")) {
  errors.push("static manifest must not point to a Cubism entry");
}
requireFile(path.resolve(path.dirname(manifestPath), manifest.entry || ""));

const tips = JSON.parse(fs.readFileSync(tipsPath, "utf8"));
for (const key of ["idle", "character", "click", "mouseover"]) {
  if (!Array.isArray(tips[key])) errors.push(`waifu-tips.json: ${key} must be an array`);
}
for (const group of ["click", "mouseover"]) {
  for (const rule of tips[group] || []) {
    if (!rule.selector || !Array.isArray(rule.text) || !rule.text.length) {
      errors.push(`waifu-tips.json: invalid ${group} rule`);
    }
  }
}

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const count = (source.match(/\.\/js\/waifu-pet\.js/g) || []).length;
  if (count !== 1) errors.push(`${file}: expected one waifu loader, found ${count}`);
}

const script = fs.readFileSync(scriptPath, "utf8");
if (/@latest|https?:\/\/[^"']+\.(?:js|json)/i.test(script)) {
  errors.push("waifu-pet.js must not load remote runtime or JSON resources");
}
if (/window\.onload|window\.onresize|document\.onmousemove/.test(script)) {
  errors.push("waifu-pet.js must use addEventListener instead of global event properties");
}
for (const token of ["SCALE_KEY", "updateTipSide", "is-tip-left", 'data-waifu-action=\"smaller\"', 'data-waifu-action=\"larger\"']) {
  if (!script.includes(token)) errors.push(`waifu-pet.js missing scale control: ${token}`);
}

const style = fs.readFileSync(stylePath, "utf8");
if (
  !style.includes("left: calc(100% - 6px)") ||
  !style.includes("right: calc(100% - 6px)") ||
  !style.includes("--waifu-user-width") ||
  !style.includes("scale(var(--waifu-scale))")
) {
  errors.push("waifu.css must flip tips around the character and scale the complete bubble");
}
const unsafeSelectors = style
  .split(/\r?\n/)
  .filter((line) => line.includes("{"))
  .filter((line) => !line.trim().startsWith("@"))
  .filter((line) => !/^\s*(?:from|to|\d+%|[\d%,\s]+)\s*\{/.test(line))
  .filter((line) => !line.includes("#waifu"));
if (unsafeSelectors.length) {
  errors.push(`waifu.css contains unscoped selector lines: ${unsafeSelectors.join(" | ")}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`waifu audit passed: ${htmlFiles.length} pages, static asset ${manifest.entry}`);
