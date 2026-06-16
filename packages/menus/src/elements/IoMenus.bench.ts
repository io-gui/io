import { describe } from 'vitest'
import { benchHeavy } from '../../../core/src/testing/bench.js'
import {
  benchFreshVsCached,
  benchInitialRender,
  createFlatMenuOptions,
  createMenuOptionTree,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { MenuOption } from '../nodes/MenuOption.js'
import { IoMenuTree, IoMenuOptions, IoMenuItem, IoOptionSelect } from '@io-gui/menus'

describe('IoMenuTree', () => {
  const option = createMenuOptionTree(3, 10)

  benchInitialRender('tree depth 3 breadth 10', (mount) => {
    const el = new IoMenuTree({ option: createMenuOptionTree(3, 10), searchable: true })
    mount(el)
    el.changed()
    el.dispose()
  }, true)

  const steadyTree = new IoMenuTree({ option, searchable: true, depth: 3 })
  warmElement(steadyTree, () => steadyTree.changed())

  benchFreshVsCached({
    label: 'optionMutated',
    heavy: true,
    fresh: () => {
      option.options[0].label = option.options[0].label === 'Branch 0-0' ? 'Branch 0-0!' : 'Branch 0-0'
      steadyTree.optionMutated()
    },
  })

  benchHeavy('steady: search keystroke', () => {
    steadyTree.search = steadyTree.search ? '' : 'Leaf 2-0'
    steadyTree.changed()
  })
})

describe('IoMenuOptions', () => {
  const option = createFlatMenuOptions(50)

  benchInitialRender('50 flat options', (mount) => {
    const el = new IoMenuOptions({ option: createFlatMenuOptions(50), searchable: true })
    mount(el)
    el.changed()
    el.dispose()
  }, true)

  const steadyOptions = new IoMenuOptions({ option, searchable: true })
  warmElement(steadyOptions, () => steadyOptions.changed())

  benchFreshVsCached({
    label: 'search keystroke',
    heavy: true,
    fresh: () => {
      steadyOptions.search = steadyOptions.search ? '' : 'Option 1'
      steadyOptions.changed()
    },
  })
})

describe('IoMenuItem', () => {
  const option = new MenuOption({ id: 'item', label: 'Menu Item', icon: 'io:box' })

  benchInitialRender('menu item', (mount) => {
    const el = new IoMenuItem({ option: new MenuOption({ id: 'item', label: 'Menu Item', icon: 'io:box' }) })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyItem = new IoMenuItem({ option })
  warmElement(steadyItem, () => steadyItem.changed())

  benchFreshVsCached({
    label: 'label/selected mutation',
    fresh: () => {
      option.label = option.label === 'Menu Item' ? 'Selected Item' : 'Menu Item'
      option.selected = !option.selected
      steadyItem.optionMutated()
    },
  })
})

describe('IoOptionSelect', () => {
  const option = createFlatMenuOptions(20)

  benchInitialRender('option select', (mount) => {
    const el = new IoOptionSelect({ option: createFlatMenuOptions(20), label: 'Pick one' })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadySelect = new IoOptionSelect({ option, label: 'Pick one', value: 'opt0' })
  warmElement(steadySelect, () => steadySelect.changed())

  benchFreshVsCached({
    label: 'selection label change',
    fresh: () => {
      steadySelect.value = steadySelect.value === 'opt0' ? 'opt1' : 'opt0'
      steadySelect.changed()
    },
  })
})
