import { describe } from 'vitest'
import { benchHeavy } from '../../../core/src/testing/bench.js'
import {
  benchFreshVsCached,
  benchInitialRender,
  createMenuOptionTree,
  createNavigatorElements,
  createNavigatorMenuOptions,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { div } from '@io-gui/core'
import { ioMenuTree } from '@io-gui/menus'
import {
  IoNavigator,
  IoNavigatorDrawer,
  IoCollapsible,
  IoSelector,
} from '@io-gui/navigation'

const NAV_ELEMENTS = createNavigatorElements(30)

describe('IoNavigator', () => {
  const option = createNavigatorMenuOptions(30)

  benchInitialRender('navigator 30 options', (mount) => {
    const el = new IoNavigator({
      option: createNavigatorMenuOptions(30),
      elements: NAV_ELEMENTS,
      menu: 'left',
      select: 'shallow',
    })
    mount(el)
    el.changed()
    el.dispose()
  }, true)

  const steadyNavigator = new IoNavigator({
    option,
    elements: NAV_ELEMENTS,
    menu: 'left',
    select: 'shallow',
  })
  warmElement(steadyNavigator, () => steadyNavigator.changed(), { width: 900, height: 600 })

  benchFreshVsCached({
    label: 'optionMutated / selection',
    heavy: true,
    fresh: () => {
      option.options[5].selected = !option.options[5].selected
      steadyNavigator.optionMutated()
    },
  })
})

describe('IoNavigatorDrawer', () => {
  const option = createMenuOptionTree(2, 6)
  const menuContent = ioMenuTree({ option, depth: 2 })

  benchInitialRender('navigator drawer', (mount) => {
    const el = new IoNavigatorDrawer({
      direction: 'left',
      menuContent: ioMenuTree({ option: createMenuOptionTree(2, 6), depth: 2 }),
    })
    mount(el)
    el.changed()
    el.dispose()
  }, true)

  const steadyDrawer = new IoNavigatorDrawer({ direction: 'left', menuContent })
  warmElement(steadyDrawer, () => steadyDrawer.changed(), { width: 400, height: 600 })

  benchFreshVsCached({
    label: 'expand toggle',
    heavy: true,
    fresh: () => {
      steadyDrawer.expanded = !steadyDrawer.expanded
      steadyDrawer.changed()
    },
  })
})

describe('IoCollapsible', () => {
  const elements = [
    div({ id: 'a' }, 'A'),
    div({ id: 'b' }, 'B'),
    div({ id: 'c' }, 'C'),
  ]

  benchInitialRender('collapsible', (mount) => {
    const el = new IoCollapsible({ label: 'Section', elements, expanded: true })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyCollapsible = new IoCollapsible({ label: 'Section', elements, expanded: true })
  warmElement(steadyCollapsible, () => steadyCollapsible.changed())

  benchFreshVsCached({
    label: 'expand/collapse',
    fresh: () => {
      steadyCollapsible.expanded = !steadyCollapsible.expanded
      steadyCollapsible.changed()
    },
  })
})

describe('IoSelector', () => {
  const elements = createNavigatorElements(10)

  benchInitialRender('selector cache miss', (mount) => {
    const el = new IoSelector({ elements, selected: 'view0', caching: 'none' })
    mount(el)
    el.selectedChanged()
    el.dispose()
  })

  const steadySelector = new IoSelector({ elements, selected: 'view0', caching: 'reactive' })
  warmElement(steadySelector, () => steadySelector.selectedChanged())

  benchHeavy('steady: cache miss path', () => {
    steadySelector.caching = 'none'
    steadySelector.selected = steadySelector.selected === 'view0' ? 'view1' : 'view0'
    steadySelector.selectedChanged()
  })

  benchHeavy('steady: cache hit path', () => {
    steadySelector.caching = 'reactive'
    steadySelector.selected = 'view1'
    steadySelector.selectedChanged()
    steadySelector.selected = 'view0'
    steadySelector.selectedChanged()
  })
})
