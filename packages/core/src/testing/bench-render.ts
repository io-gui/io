import type { IoElement } from '../elements/IoElement.js'
import { bench, benchHeavy } from './bench.js'
import { Panel } from '@io-gui/layout'
import { Split } from '@io-gui/layout'
import { Tab } from '@io-gui/layout'
import { MenuOption } from '@io-gui/menus'

export type BenchMountOptions = {
  width?: number
  height?: number
}

let steadyContainer: HTMLElement | undefined

function containerStyle(width: number, height: number) {
  return [
    'position:fixed',
    'left:-9999px',
    'top:0',
    `width:${width}px`,
    `height:${height}px`,
    'overflow:hidden',
  ].join(';')
}

export function getSteadyBenchContainer(options: BenchMountOptions = {}): HTMLElement {
  const { width = 1200, height = 800 } = options
  if (!steadyContainer) {
    steadyContainer = document.createElement('div')
    steadyContainer.id = 'io-bench-steady-container'
    document.body.appendChild(steadyContainer)
  }
  steadyContainer.style.cssText = containerStyle(width, height)
  return steadyContainer
}

export function mountSteadyElement(el: IoElement, options?: BenchMountOptions): IoElement {
  const container = getSteadyBenchContainer(options)
  container.replaceChildren()
  container.appendChild(el)
  return el
}

export function withIsolatedBenchMount(
  fn: (mount: (el: IoElement) => IoElement) => void,
  options?: BenchMountOptions,
): void {
  const { width = 1200, height = 800 } = options ?? {}
  const container = document.createElement('div')
  container.style.cssText = containerStyle(width, height)
  document.body.appendChild(container)
  try {
    fn((el) => {
      container.appendChild(el)
      return el
    })
  } finally {
    container.remove()
  }
}

export function warmRender(fn: () => void): void {
  fn()
}

export function warmElement(el: IoElement, renderFn: () => void, options?: BenchMountOptions): IoElement {
  mountSteadyElement(el, options)
  warmRender(renderFn)
  return el
}

export type FreshCachedBenchOptions = {
  label: string
  fresh: () => void
  cached?: () => void
  heavy?: boolean
}

export function benchFreshVsCached(options: FreshCachedBenchOptions): void {
  const { label, fresh, cached, heavy } = options
  const run = heavy ? benchHeavy : bench
  run(`steady: re-render fresh VDOM — ${label}`, fresh)
  if (cached) {
    run(`steady: re-render cached VDOM — ${label}`, cached)
  }
}

export function benchInitialRender(name: string, fn: () => void, heavy = false): void {
  const run = heavy ? benchHeavy : bench
  run(`initial render: ${name}`, () => {
    withIsolatedBenchMount((mount) => {
      fn(mount)
    })
  })
}

export function createTabs(count: number, prefix = 'tab'): Tab[] {
  return Array.from({ length: count }, (_, i) => new Tab({
    id: `${prefix}${i}`,
    label: `Tab ${i}`,
    icon: i % 3 === 0 ? 'io:box' : '',
  }))
}

export function createPanelWithTabs(tabCount: number): Panel {
  return new Panel({
    type: 'panel',
    tabs: createTabs(tabCount).map(tab => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
    })),
  })
}

export function createSplitWithPanels(
  panelCount: number,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
): Split {
  const children = Array.from({ length: panelCount }, (_, i) => ({
    type: 'panel' as const,
    tabs: [{ id: `panel${i}`, label: `Panel ${i}` }],
    flex: i === panelCount - 1 ? '1 1 auto' : '0 0 200px',
  }))
  return new Split({ type: 'split', orientation, children })
}

export function createFlatMenuOptions(count: number): MenuOption {
  const options = Array.from({ length: count }, (_, i) => new MenuOption({
    id: `opt${i}`,
    label: `Option ${i}`,
    icon: i % 4 === 0 ? 'io:box' : '',
  }))
  return new MenuOption({ options })
}

export function createMenuOptionTree(depth: number, breadth: number): MenuOption {
  function build(level: number): MenuOption[] {
    if (level >= depth) {
      return Array.from({ length: breadth }, (_, i) => new MenuOption({
        id: `leaf-${level}-${i}`,
        label: `Leaf ${level}-${i}`,
      }))
    }
    return Array.from({ length: breadth }, (_, i) => {
      const branch = new MenuOption({
        id: `branch-${level}-${i}`,
        label: `Branch ${level}-${i}`,
      })
      branch.options.push(...build(level + 1))
      return branch
    })
  }
  return new MenuOption({ options: build(0) })
}

export function createLayoutElements(prefix: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    tag: 'div',
    props: { id: `${prefix}${i}`, label: `${prefix} ${i}` },
    children: [`${prefix} ${i}`],
  }))
}

export function createNavigatorElements(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    tag: 'div',
    props: { id: `view${i}`, label: `View ${i}` },
    children: [`Content ${i}`],
  }))
}

export function createNavigatorMenuOptions(count: number): MenuOption {
  const options = Array.from({ length: count }, (_, i) => new MenuOption({
    id: `view${i}`,
    label: `Option ${i}`,
    icon: i % 4 === 0 ? 'io:box' : '',
  }))
  return new MenuOption({ options })
}

export function createPropertyEditorValue() {
  return {
    name: 'Widget',
    count: 12,
    ratio: 0.5,
    enabled: true,
    visible: false,
    scale: 1.25,
    opacity: 0.8,
    priority: 3,
    weight: 0.33,
    offset: 10,
    limit: 100,
    speed: 2.5,
    delay: 0.1,
    active: true,
    locked: false,
    tags: ['alpha', 'beta'],
    label: 'Sample',
    code: 'ABC',
    nested: { x: 1, y: 2, z: 3 },
    extras: { note: 'bench' },
  }
}

export function createInspectorValue() {
  const root = createPropertyEditorValue()
  const child = {
    name: 'Child',
    count: 4,
    enabled: true,
    nested: { depth: 2 },
  }
  return { root, child, value: root }
}
