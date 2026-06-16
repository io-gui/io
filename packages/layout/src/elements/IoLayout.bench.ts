import { describe } from 'vitest'
import { benchHeavy } from '../../../core/src/testing/bench.js'
import {
  benchFreshVsCached,
  benchInitialRender,
  createLayoutElements,
  createPanelWithTabs,
  createSplitWithPanels,
  createTabs,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { IoSplit, IoPanel, IoTabs, IoTab, IoDrawer } from '@io-gui/layout'
import { Panel } from '../nodes/Panel.js'

describe('IoSplit', () => {
  const split = createSplitWithPanels(4, 'horizontal')
  const elements = createLayoutElements('panel', 4)

  benchInitialRender('4-panel split', (mount) => {
    const el = new IoSplit({ split: createSplitWithPanels(4), elements: createLayoutElements('panel', 4) })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadySplit = new IoSplit({ split, elements })
  warmElement(steadySplit, () => steadySplit.changed())

  benchFreshVsCached({
    label: 'splitMutated',
    fresh: () => {
      split.children[0].flex = split.children[0].flex === '0 0 200px' ? '0 0 220px' : '0 0 200px'
      steadySplit.splitMutated()
    },
  })

  benchHeavy('steady: drawer collapse toggle', () => {
    steadySplit.leadingDrawer = steadySplit.leadingDrawer
      ? null
      : steadySplit.split.children[0] as Panel
    steadySplit.changed()
  })
})

describe('IoPanel', () => {
  const panel = createPanelWithTabs(8)
  const elements = createLayoutElements('tab', 8)

  benchInitialRender('8-tab panel', (mount) => {
    const el = new IoPanel({ panel: createPanelWithTabs(8), elements: createLayoutElements('tab', 8) })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyPanel = new IoPanel({ panel, elements })
  warmElement(steadyPanel, () => steadyPanel.changed())

  benchFreshVsCached({
    label: 'tab select',
    fresh: () => {
      const tab = panel.tabs[(panel.tabs.findIndex(t => t.selected) + 1) % panel.tabs.length]
      panel.setSelected(tab.id)
      steadyPanel.panelMutated()
    },
  })

  benchHeavy('steady: tab add/remove', () => {
    const tab = createTabs(1, 'bench')[0]
    steadyPanel.addTab(tab)
    steadyPanel.removeTab(tab)
  })
})

describe('IoTabs', () => {
  const tabs = createTabs(12)

  benchInitialRender('12 tabs', (mount) => {
    const el = new IoTabs({ tabs: createTabs(12) })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyTabs = new IoTabs({ tabs })
  warmElement(steadyTabs, () => steadyTabs.changed())

  benchFreshVsCached({
    label: 'tabsMutated',
    fresh: () => {
      tabs[2].label = tabs[2].label === 'Tab 2' ? 'Tab 2x' : 'Tab 2'
      steadyTabs.tabsMutated()
    },
  })
})

describe('IoTab', () => {
  const tab = createTabs(1)[0]

  benchInitialRender('tab', (mount) => {
    const el = new IoTab({ tab: createTabs(1)[0] })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyTab = new IoTab({ tab })
  warmElement(steadyTab, () => steadyTab.changed())

  benchFreshVsCached({
    label: 'label mutation',
    fresh: () => {
      tab.label = tab.label === 'Tab 0' ? 'Tab 0x' : 'Tab 0'
      steadyTab.tabMutated()
    },
  })
})

describe('IoDrawer', () => {
  const drawerSplit = createSplitWithPanels(2)
  const childPanel = drawerSplit.children[0] as Panel
  const elements = createLayoutElements('panel', 2)

  benchInitialRender('drawer with panel', (mount) => {
    const split = createSplitWithPanels(2)
    const host = new IoSplit({ split, elements: createLayoutElements('panel', 2) })
    mount(host)
    host.changed()
    const el = new IoDrawer({
      orientation: 'horizontal',
      direction: 'leading',
      parent: host,
      child: split.children[0] as Panel,
      elements: createLayoutElements('panel', 2),
    })
    host.appendChild(el)
    el.changed()
    el.dispose()
    host.dispose()
  })

  const host = new IoSplit({ split: drawerSplit, elements })
  warmElement(host, () => host.changed())
  const steadyDrawer = new IoDrawer({
    orientation: 'horizontal',
    direction: 'leading',
    parent: host,
    child: childPanel,
    elements,
  })
  host.appendChild(steadyDrawer)
  warmElement(steadyDrawer, () => steadyDrawer.changed())

  benchFreshVsCached({
    label: 'child panel resize',
    fresh: () => {
      childPanel.flex = childPanel.flex === '0 0 200px' ? '0 0 240px' : '0 0 200px'
      steadyDrawer.childMutated()
    },
  })
})
