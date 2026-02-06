import { readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const levelsDir = join(__dirname, 'public', 'levels');

const levels = readdirSync(levelsDir)
  .filter(f => f.startsWith('lvl_') && f.endsWith('.json') && f !== 'index.json')
  .map(f => f.replace('.json', ''))
  .sort();

writeFileSync(join(levelsDir, 'index.json'), JSON.stringify(levels, null, 2) + '\n');

console.log(`Generated index.json with ${levels.length} levels.`);
