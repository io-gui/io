import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const levelsDir = join(__dirname, '..', 'public', 'levels')

const files = readdirSync(levelsDir)
  .filter((file) => file.startsWith('lvl_') && file.endsWith('.json'))
  .sort()

const normalizeId = (value) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && Number.isFinite(Number(value))) return Number(value)
  return Math.floor(Math.random() * 1000000)
}

for (const file of files) {
  const path = join(levelsDir, file)
  const level = JSON.parse(readFileSync(path, 'utf8'))

  const pads = []
  for (const pad of level.pads ?? []) {
    const color = typeof pad.color === 'string' ? pad.color : 'white'
    const isTerminal = typeof pad.isTerminal === 'boolean'
      ? pad.isTerminal
      : color !== 'white'

    pads.push({
      id: normalizeId(pad.id ?? pad.ID),
      pos: pad.pos,
      color: isTerminal ? color : 'white',
      isTerminal,
    })
  }

  for (const terminal of level.terminals ?? []) {
    pads.push({
      id: normalizeId(terminal.id ?? terminal.ID),
      pos: terminal.pos,
      color: terminal.color ?? 'red',
      isTerminal: true,
    })
  }

  const lines = (level.lines ?? []).map((line) => ({
    id: normalizeId(line.id ?? line.ID),
    pos: line.pos ?? [],
    layer: typeof line.layer === 'number' ? line.layer : 0,
  }))

  const migrated = {
    width: level.width,
    height: level.height,
    pads,
    lines,
  }

  writeFileSync(path, JSON.stringify(migrated, null, 2) + '\n')
  console.log(`${file}: pads=${pads.length}, lines=${lines.length}`)
}

console.log(`Migrated ${files.length} level files in ${levelsDir}`)
