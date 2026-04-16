// 画像をWebPに変換するスクリプト
// 100KB以上のPNG/JPGをWebPに変換（オリジナルは保持）
// 使い方: node scripts/convert-to-webp.mjs

import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const MIN_SIZE_BYTES = 100 * 1024; // 100KB以上を対象
const WEBP_QUALITY = 82; // 品質と容量のバランス

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function main() {
  let converted = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for await (const file of walk(PUBLIC_DIR)) {
    const ext = path.extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

    const stats = await stat(file);
    if (stats.size < MIN_SIZE_BYTES) {
      skipped++;
      continue;
    }

    const outFile = file.replace(/\.(png|jpe?g)$/i, ".webp");
    try {
      const info = await sharp(file)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outFile);
      const reduction = (
        ((stats.size - info.size) / stats.size) *
        100
      ).toFixed(1);
      console.log(
        `✓ ${path.relative(PUBLIC_DIR, file)} -> .webp ` +
          `(${(stats.size / 1024).toFixed(0)}KB → ${(info.size / 1024).toFixed(
            0
          )}KB, -${reduction}%)`
      );
      converted++;
      totalBefore += stats.size;
      totalAfter += info.size;
    } catch (err) {
      console.error(`✗ Failed: ${file}`, err.message);
    }
  }

  console.log("\n=== サマリー ===");
  console.log(`変換: ${converted}件 / スキップ(100KB未満): ${skipped}件`);
  console.log(
    `合計: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(
      totalAfter /
      1024 /
      1024
    ).toFixed(2)}MB ` +
      `(削減 ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
