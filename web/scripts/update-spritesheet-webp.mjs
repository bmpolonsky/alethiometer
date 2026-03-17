import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const sourcePath = path.join(projectRoot, "public/assets/graphics-spritesheet.png");
const outputPath = path.join(projectRoot, "public/assets/graphics-spritesheet.webp");

const ffmpegArgs = [
  "-y",
  "-i",
  sourcePath,
  "-c:v",
  "libwebp",
  "-q:v",
  "95",
  outputPath,
];

const result = spawnSync("ffmpeg", ffmpegArgs, {
  cwd: projectRoot,
  stdio: "inherit",
});

if (result.error) {
  if (result.error.code === "ENOENT") {
    console.error("ffmpeg is required to update graphics-spritesheet.webp");
  } else {
    console.error(result.error.message);
  }

  process.exit(1);
}

process.exit(result.status ?? 1);
