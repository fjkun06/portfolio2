/**
 * Makes each project's link-preview image (Open Graph, 1200 × 630) from its screenshot:
 * the screenshot, top-aligned with rounded corners, on the dark board background.
 * Writes public/og/work/<slug>.jpg, the address projectOgImage() points to.
 *
 * Run it again whenever a screenshot in public/work changes or a project is added:
 *   node scripts/og-work.mjs
 *
 * The project list is read from src/content/projects.ts (each `slug` and the screenshot
 * imported for its `image`), so there's no second list to keep in sync.
 */
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "public/og/work");
const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 32;
const RADIUS = 14;
const BOARD = "#141517";
const RULE = "#2a2c30";

/** Pairs each project slug with its screenshot file, read from projects.ts. */
async function projectShots() {
  const source = await readFile(join(ROOT, "src/content/projects.ts"), "utf8");
  const files = Object.fromEntries(
    [...source.matchAll(/import (\w+) from "\.\.\/\.\.\/public\/work\/([\w.-]+)";/g)].map(
      ([, name, file]) => [name, file],
    ),
  );
  const shots = [];
  for (const match of source.matchAll(/slug: "([\w-]+)"/g)) {
    const rest = source.slice(match.index);
    const image = /\n\s*image: (\w+)/.exec(rest)?.[1];
    if (image && image !== "null" && files[image]) {
      shots.push({ slug: match[1], file: join(ROOT, "public/work", files[image]) });
    }
  }
  return shots;
}

/** One preview image: the screenshot cropped from the top, with a thin rule around it. */
async function render({ slug, file }) {
  const w = WIDTH - PAD * 2;
  const h = HEIGHT - PAD * 2;
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${RADIUS}" fill="#fff"/></svg>`,
  );
  const shot = await sharp(file)
    .resize(w, h, { fit: "cover", position: "top" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  const frame = Buffer.from(
    `<svg width="${WIDTH}" height="${HEIGHT}"><rect x="${PAD - 0.5}" y="${PAD - 0.5}" width="${w + 1}" height="${h + 1}" rx="${RADIUS}" fill="none" stroke="${RULE}"/></svg>`,
  );
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: BOARD } })
    .composite([
      { input: shot, left: PAD, top: PAD },
      { input: frame, left: 0, top: 0 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(OUT, `${slug}.jpg`));
  console.log(`og/work/${slug}.jpg`);
}

await mkdir(OUT, { recursive: true });
for (const shot of await projectShots()) await render(shot);
