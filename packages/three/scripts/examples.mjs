// Tools for the sidecars of the converted three.js examples (packages/three/src/demos/ExamplesConversion.plan.md,
// Sidecars). Run from anywhere in the repository:
//
//   node packages/three/scripts/examples.mjs check      sidecars, code, the plan and ../three.js agree
//   node packages/three/scripts/examples.mjs index      rewrite the plan's generated blocks
//   node packages/three/scripts/examples.mjs upstream [--bump-unchanged]
//                                                       upstream commits after each sidecar's `synced`

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const DEMOS = join(ROOT, 'packages/three/src/demos')
const EXAMPLES = join(DEMOS, 'examples')
const HOST = join(DEMOS, 'IoEditorExample.ts')
const CONTEXT = join(DEMOS, 'CONTEXT.md')
const PLAN = join(DEMOS, 'ExamplesConversion.plan.md')
const UPSTREAM_PLAN = join(ROOT, '.cursor/plans/three_upstream_fixes.plan.md')
const THREE = resolve(ROOT, '../three.js')

const SECTIONS = ['Deviations', 'Workarounds', 'Open', 'Upstream', 'Related', 'History']
const VERBS = ['Converted', 'Checked', 'Fixed', 'Changed', 'Synced', 'Filed', 'Workaround added', 'Workaround removed']
const BLOCK = /<!-- examples\.mjs:(\w+) -->\n[\s\S]*?<!-- \/examples\.mjs -->/g

const read = (file) => readFileSync(file, 'utf8')
const local = (file) => relative(ROOT, file)

function git(...args) {
  return execFileSync('git', ['-C', THREE, ...args], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}).trim()
}

function gitOk(...args) {
  try {
    git(...args)
    return true
  } catch {
    return false
  }
}

/** A sidecar's frontmatter: flat `key: value` and `key: [a, b]` lines. */
function frontmatter(text) {
  const result = {}
  const match = text.match(/^---\n([\s\S]*?)\n---\n/)
  for (const line of match ? match[1].split('\n') : []) {
    const [, key, value] = line.match(/^(\w+):\s*(.*)$/) ?? []
    if (!key) continue
    result[key] = value.startsWith('[') ? value.slice(1, -1).split(',').map(item => item.trim()).filter(Boolean) : value
  }
  return result
}

/** The body of the section titled `title` (any heading level, up to the next heading at its level or above), or null. */
function section(text, title) {
  const lines = text.split('\n')
  let fenced = false
  let level = 0
  let start = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('```')) fenced = !fenced
    const heading = !fenced && lines[i].match(/^(#+) (.+)$/)
    if (!heading) continue
    if (start >= 0 && heading[1].length <= level) return lines.slice(start + 1, i).join('\n')
    if (start < 0 && heading[2].trim() === title) {
      start = i
      level = heading[1].length
    }
  }
  return start >= 0 ? lines.slice(start + 1).join('\n') : null
}

/** The ids leading a section's bullets: "- `id`: ...". */
const leadingIds = (body) => [...(body ?? '').matchAll(/^- `([^`]+)`/gm)].map(match => match[1])

const todoIds = (text) => [...text.matchAll(/^\s+- id: (\S+)$/gm)].map(match => match[1])

function readSidecars() {
  return readdirSync(EXAMPLES).filter(file => file.endsWith('Example.md')).map(file => {
    const text = read(join(EXAMPLES, file))
    const titles = [...text.matchAll(/^## (.+)$/gm)].map(match => match[1].trim())
    return {name: file.slice(0, -'Example.md'.length), file: join(EXAMPLES, file), text, front: frontmatter(text), titles}
  }).sort((a, b) => a.name < b.name ? -1 : 1)
}

const codeNames = () => readdirSync(EXAMPLES).filter(file => file.endsWith('Example.ts')).map(file => file.slice(0, -'Example.ts'.length))

const documentNames = () => [...read(HOST).matchAll(/^\s+(\w+)Example: \(\) => import\(/gm)].map(match => match[1])

/** Ids of the `Workaround (upstream: <id>)` comments in a file, also where a comment wraps inside the marker. */
function workaroundIds(code) {
  const flat = code.replace(/\n\s*(\*|\/\/)\s*/g, ' ')
  return [...new Set([...flat.matchAll(/Workaround \(upstream: ([^)]+)\)/g)].map(match => match[1].trim()))]
}

/** Relative links in the prose of a markdown file whose target does not exist. */
function brokenLinks(file) {
  const prose = read(file).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
  return [...prose.matchAll(/\]\(([^)\s]+)\)/g)].map(match => match[1])
    .filter(target => !/^[a-z]+:/.test(target) && !target.startsWith('#'))
    .filter(target => !existsSync(resolve(dirname(file), decodeURI(target.split('#')[0]))))
}

/** Tags of the plan's Tags table. */
const planTags = (plan) => [...(section(plan, 'Tags') ?? '').matchAll(/^\| `([^`]+)` \|/gm)].map(match => match[1])

/** Examples of the plan's TODO rows. */
const planTodo = (plan) => [...(section(plan, 'TODO') ?? '').matchAll(/^\| ([A-Z]\w*) \| `/gm)].map(match => match[1])

/** Ids an Open or Workarounds bullet may lead with: the plans' todos and the conversion plan's blockers. */
function definedIds(plan) {
  const blockers = [...(section(plan, 'Blockers') ?? '').matchAll(/^- \*\*`([^`]+)`\*\*/gm)].map(match => match[1])
  return new Set([...todoIds(plan), ...blockers, ...todoIds(read(UPSTREAM_PLAN))])
}

/** The plan's generated blocks, from the sidecars. */
function blocks(sidecars, plan) {
  const groups = new Map()
  for (const {name} of sidecars) {
    const word = name.match(/^[A-Z][a-z]*/)[0]
    groups.set(word, [...groups.get(word) ?? [], name])
  }
  const converted = [
    `${sidecars.length} examples; each has its sidecar \`examples/<Name>Example.md\`.`,
    '',
    ...[...groups].map(([word, names]) => `- **${word}** (${names.length}): ${names.join(', ')}`),
  ]

  const ids = (list) => list.map(id => `\`${id}\``).join(', ')
  const open = [
    '| Example | Open | Workarounds |',
    '|---|---|---|',
    ...sidecars.map(({name, text}) => ({name, open: leadingIds(section(text, 'Open')), workarounds: leadingIds(section(text, 'Workarounds'))}))
      .filter(row => row.open.length || row.workarounds.length)
      .map(row => `| [${row.name}](examples/${row.name}Example.md) | ${ids(row.open)} | ${ids(row.workarounds)} |`),
  ]

  const tagged = new Map(planTags(plan).map(tag => [tag, []]))
  for (const {name, front} of sidecars) for (const tag of front.tags ?? []) tagged.get(tag)?.push(name)
  const tags = [...tagged].map(([tag, names]) => `- \`${tag}\` (${names.length}): ${names.join(', ')}`)

  return {converted: converted.join('\n'), open: open.join('\n'), tags: tags.join('\n')}
}

const withBlocks = (plan, generated) => plan.replace(BLOCK, (whole, name) => name in generated ? `<!-- examples.mjs:${name} -->\n${generated[name]}\n<!-- /examples.mjs -->` : whole)

function check() {
  const errors = []
  const warnings = []
  const sidecars = readSidecars()
  const plan = PLAN ? read(PLAN) : ''
  const names = new Set(sidecars.map(sidecar => sidecar.name))
  const code = new Set(codeNames())
  const documents = new Set(documentNames())
  const todo = new Set(planTodo(plan))
  const tags = new Set(planTags(plan))
  const ids = definedIds(plan)

  for (const name of code) {
    if (!names.has(name)) errors.push(`${name}: no sidecar`)
    if (!documents.has(name)) errors.push(`${name}: not in DOCUMENTS (${local(HOST)})`)
  }

  for (const sidecar of sidecars) {
    const {name, text, front, titles} = sidecar
    const say = (list, message) => list.push(`${name}: ${message}`)

    if (!code.has(name) && !todo.has(name)) say(errors, `no ${name}Example.ts, and no TODO row in the plan`)
    if (text.includes('<!-- draft -->')) say(errors, 'still a draft')

    if (!front.source) say(errors, 'no `source`')
    else if (!gitOk('cat-file', '-e', `HEAD:examples/${front.source}.html`)) say(errors, `examples/${front.source}.html is not in ../three.js HEAD (removed or renamed upstream?)`)
    if (!front.synced) say(errors, 'no `synced`')
    else if (!gitOk('cat-file', '-e', `${front.synced}^{commit}`)) say(errors, `\`synced\` ${front.synced} is not a commit in ../three.js`)
    for (const path of front.watch ?? []) if (!gitOk('cat-file', '-e', `HEAD:${path}`)) say(warnings, `watched ${path} is not in ../three.js HEAD`)
    if (tags.size) for (const tag of front.tags ?? []) if (!tags.has(tag)) say(errors, `tag \`${tag}\` is not in the plan's Tags table`)

    for (const title of titles) if (!SECTIONS.includes(title)) say(errors, `unknown section "${title}"`)
    const order = titles.filter(title => SECTIONS.includes(title)).map(title => SECTIONS.indexOf(title))
    if (order.some((index, i) => i && index < order[i - 1])) say(errors, `sections out of order (${SECTIONS.join(', ')})`)
    for (const title of ['Deviations', 'History']) if (!titles.includes(title)) say(errors, `no ${title} section`)

    const workarounds = leadingIds(section(text, 'Workarounds'))
    for (const id of [...leadingIds(section(text, 'Open')), ...workarounds]) {
      if (!/^#\d+$/.test(id) && !ids.has(id)) say(errors, `\`${id}\` is no todo or blocker of the plans`)
    }
    if (code.has(name)) {
      const marked = workaroundIds(read(join(EXAMPLES, `${name}Example.ts`)))
      for (const id of marked) if (!workarounds.includes(id)) say(errors, `the code's workaround \`${id}\` is not under Workarounds`)
      for (const id of workarounds) if (!marked.includes(id)) say(errors, `Workarounds lists \`${id}\`, which the code does not mark`)
    }

    const entries = (section(text, 'History') ?? '').split('\n').filter(line => line.startsWith('- '))
    for (const entry of entries) {
      if (!new RegExp(`^- \\d{4}-\\d{2}-\\d{2}: (${VERBS.join('|')})\\b`).test(entry)) say(warnings, `History entry without a date and verb: ${entry.slice(0, 60)}`)
    }
    const dates = entries.map(entry => entry.slice(2, 12))
    if (dates.some((date, i) => i && date < dates[i - 1])) say(warnings, 'History is not oldest first')
  }

  for (const file of [...sidecars.map(sidecar => sidecar.file), PLAN, CONTEXT].filter(file => file && existsSync(file))) {
    for (const target of brokenLinks(file)) errors.push(`${local(file)}: broken link ${target}`)
  }

  if (plan.match(BLOCK) && withBlocks(plan, blocks(sidecars, plan)) !== plan) errors.push(`${local(PLAN)}: generated blocks are stale; run index`)
  if (!tags.size) warnings.push(`${PLAN ? local(PLAN) : 'plan'}: no Tags table; tags not checked`)

  for (const warning of warnings) console.log(`warning ${warning}`)
  for (const error of errors) console.log(`error   ${error}`)
  console.log(`${sidecars.length} sidecars, ${errors.length} errors, ${warnings.length} warnings`)
  return errors.length ? 1 : 0
}

function index() {
  const plan = read(PLAN)
  if (!plan.match(BLOCK)) {
    console.log(`${local(PLAN)} has no generated blocks`)
    return 1
  }
  const updated = withBlocks(plan, blocks(readSidecars(), plan))
  if (updated !== plan) writeFileSync(PLAN, updated)
  console.log(`${local(PLAN)}: ${updated === plan ? 'up to date' : 'updated'}`)
  return 0
}

function upstream(bump) {
  const head = git('rev-parse', 'HEAD')
  const short = git('rev-parse', '--short=10', 'HEAD')
  let changed = 0
  let bumped = 0
  for (const sidecar of readSidecars()) {
    const {source, synced, watch = []} = sidecar.front
    if (!source || !synced) continue
    if (!gitOk('cat-file', '-e', `HEAD:examples/${source}.html`)) console.log(`${sidecar.name}: examples/${source}.html is gone at HEAD`)
    const log = git('log', '--format=%h %s', `${synced}..HEAD`, '--', `examples/${source}.html`, ...watch)
    if (log) {
      changed++
      console.log(`${sidecar.name} (${source}, synced ${synced}):\n${log.split('\n').map(line => `  ${line}`).join('\n')}`)
    } else if (bump && git('rev-parse', synced) !== head) {
      bumped++
      writeFileSync(sidecar.file, sidecar.text.replace(/^synced: .*$/m, `synced: ${short}`))
    }
  }
  console.log(`${changed} examples with upstream commits to review${bump ? `; ${bumped} unchanged sidecars moved to ${short}` : ''}`)

  const sorted = PLAN && read(PLAN).match(/Sorted through `([0-9a-f]+)`/)?.[1]
  if (!sorted) return 0
  const added = git('log', '--diff-filter=A', '--name-only', '--format=', `${sorted}..HEAD`, '--', 'examples')
    .split('\n').filter(path => /^examples\/[^/]+\.html$/.test(path))
  console.log(added.length ? `examples added upstream after ${sorted}, to sort into TODO or Not candidates:\n${added.map(path => `  ${path}`).join('\n')}` : `no examples added upstream after ${sorted}`)
  return 0
}

const [command, ...flags] = process.argv.slice(2)
const commands = {check, index, upstream: () => upstream(flags.includes('--bump-unchanged'))}
if (command in commands) process.exitCode = commands[command]()
else {
  console.log('usage: node packages/three/scripts/examples.mjs check | index | upstream [--bump-unchanged]')
  process.exitCode = 1
}
