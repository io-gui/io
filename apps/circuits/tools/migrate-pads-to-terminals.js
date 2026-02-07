import { readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const levelsDir = join(__dirname, "public", "levels");

const files = readdirSync(levelsDir).filter(
  (f) => f.startsWith("lvl_") && f.endsWith(".json")
);

for (const file of files) {
  const path = join(levelsDir, file);
  const data = JSON.parse(readFileSync(path, "utf-8"));
  const newPads = (data.pads || [])
    .filter((p) => p.color === "white")
    .map((p) => ({ pos: p.pos, ID: p.ID }));
  const terminals = (data.pads || [])
    .filter((p) => p.color !== "white")
    .map((p) => ({ pos: p.pos, color: p.color, ID: p.ID }));
  const out = {
    width: data.width,
    height: data.height,
    pads: newPads,
    terminals,
    lines: data.lines || [],
  };
  writeFileSync(path, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `${file.replace(".json", "")}: ${newPads.length} pads, ${terminals.length} terminals`
  );
}

console.log(`Migrated ${files.length} level files.`);
