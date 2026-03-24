import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const symbolsDir = path.join(projectRoot, "public/assets/symbols");

function toWebpPath(sourcePath) {
  return sourcePath.replace(/\.(png|jpe?g)$/i, ".webp");
}

function buildJobs() {
  const spritesheetPath = path.join(projectRoot, "public/assets/graphics-spritesheet.png");
  const symbolJobs = readdirSync(symbolsDir)
    .filter((fileName) => /\.(jpe?g)$/i.test(fileName))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const sourcePath = path.join(symbolsDir, fileName);

      return {
        kind: "symbol",
        sourcePath,
        outputPath: toWebpPath(sourcePath),
        quality: "95",
      };
    });

  return [
    {
      kind: "spritesheet",
      sourcePath: spritesheetPath,
      outputPath: toWebpPath(spritesheetPath),
      quality: "95",
    },
    ...symbolJobs,
  ];
}

function convertToWebp({ sourcePath, outputPath, quality }) {
  const args = [
    "-quiet",
    "-mt",
    "-q",
    quality,
    sourcePath,
    "-o",
    outputPath,
  ];
  const result = spawnSync("cwebp", args, {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      console.error("cwebp is required to update WebP assets");
    } else {
      console.error(result.error.message);
    }

    process.exit(1);
  }

  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

const jobs = buildJobs();

for (const job of jobs) {
  console.log(
    `[webp] ${job.kind}: ${path.relative(projectRoot, job.sourcePath)} -> ${path.relative(projectRoot, job.outputPath)}`,
  );
  convertToWebp(job);
}
