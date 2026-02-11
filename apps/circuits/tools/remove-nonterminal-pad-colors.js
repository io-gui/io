import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const levelsDir = join(__dirname, '..', 'public', 'levels')

const files = readdirSync(levelsDir)
  .filter((file) => file.startsWith('lvl_') && file.endsWith('.json'))
  .sort()

let updatedFiles = 0
let removedColorCount = 0
let removedIsTerminalFalseCount = 0

for (const file of files) {
  const filePath = join(levelsDir, file)
  const level = JSON.parse(readFileSync(filePath, 'utf8'))
  const pads = Array.isArray(level.pads) ? level.pads : []
  let fileChanged = false

  for (const pad of pads) {
    if (pad?.isTerminal === false && Object.prototype.hasOwnProperty.call(pad, 'color')) {
      delete pad.color
      removedColorCount++
      fileChanged = true
    }
    if (pad?.isTerminal === false && Object.prototype.hasOwnProperty.call(pad, 'isTerminal')) {
      delete pad.isTerminal
      removedIsTerminalFalseCount++
      fileChanged = true
    }
  }

  if (fileChanged) {
    writeFileSync(filePath, JSON.stringify(level, null, 2) + '\n')
    updatedFiles++
  }
}

console.log(
  `Updated ${updatedFiles} files, removed ${removedColorCount} non-terminal pad colors, and removed ${removedIsTerminalFalseCount} isTerminal:false flags.`
)
