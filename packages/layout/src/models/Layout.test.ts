import { describe, it, expect } from 'vitest'
import { DEFAULT_SIZE } from '../utils/layoutSize.js'
import { Layout } from './Layout.js'
import { Split, SplitData } from './Split.js'
import { Panel } from './Panel.js'
import { Tab } from './Tab.js'

describe('Layout', () => {

  it('should construct with Split child', () => {
    const layout = new Layout({
      child: {
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'a' }] },
          { type: 'panel', tabs: [{ id: 'b' }] },
        ],
      },
    })

    expect(layout.child instanceof Split).toBe(true)
    expect((layout.child as Split).children.length).toBe(2)
  })

  it('should construct with Panel child', () => {
    const layout = new Layout({
      child: {
        type: 'panel',
        tabs: [{ id: 'solo' }],
      },
    })

    expect(layout.child instanceof Panel).toBe(true)
    expect((layout.child as Panel).tabs[0].id).toBe('solo')
  })

  it('should round-trip JSON with Split child', () => {
    const layout = new Layout({
      child: {
        type: 'split',
        orientation: 'vertical',
        children: [{ type: 'panel', tabs: [{ id: 'tab1', selected: true }] }],
      },
    })

    const json = layout.toJSON()
    expect(json.child.type).toBe('split')
    expect((json.child as SplitData).orientation).toBe('vertical')

    const restored = new Layout(json)
    expect(restored.child instanceof Split).toBe(true)
    expect((restored.child as Split).orientation).toBe('vertical')
  })

  it('should round-trip JSON with Panel child', () => {
    const layout = new Layout({
      child: {
        type: 'panel',
        tabs: [{ id: 'only', label: 'Only Tab' }],
      },
    })

    const json = layout.toJSON()
    expect(json.child.type).toBe('panel')

    const restored = new Layout(json)
    expect(restored.child instanceof Panel).toBe(true)
    expect((restored.child as Panel).tabs[0].label).toBe('Only Tab')
  })

  describe('moveTab edge-drop', () => {

    it('places new panel first when dropping left on a non-first panel in vertical split', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          orientation: 'vertical',
          children: [
            { type: 'panel', tabs: [{ id: 'a', label: 'A' }, { id: 'drag', label: 'Drag' }] },
            { type: 'panel', tabs: [{ id: 'b', label: 'B' }] },
          ],
        },
      })

      const rootSplit = layout.child as Split
      const panelA = rootSplit.children[0] as Panel
      const panelB = rootSplit.children[1] as Panel
      const tab = panelA.tabs.find(t => t.id === 'drag') as Tab

      layout.moveTab(tab, panelB, 'left', 0)

      const bSlot = rootSplit.children[1]
      expect(bSlot instanceof Split).toBe(true)
      const horizontalSplit = bSlot as Split
      expect(horizontalSplit.orientation).toBe('horizontal')
      expect(horizontalSplit.children.length).toBe(2)
      expect((horizontalSplit.children[0] as Panel).tabs[0].id).toBe('drag')
      expect(horizontalSplit.children[1]).toBe(panelB)
    })

    it('splits lone root panel when dropping right', () => {
      const layout = new Layout({
        child: {
          type: 'panel',
          tabs: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
        },
      })

      const rootPanel = layout.child as Panel
      const tabB = rootPanel.tabs.find(t => t.id === 'b') as Tab

      layout.moveTab(tabB, rootPanel, 'right', 0)

      expect(layout.child instanceof Split).toBe(true)
      const rootSplit = layout.child as Split
      expect(rootSplit.orientation).toBe('horizontal')
      expect(rootSplit.children.length).toBe(2)
      expect(rootSplit.children[0]).toBe(rootPanel)
      expect((rootSplit.children[1] as Panel).tabs[0].id).toBe('b')
    })

    it('splits lone root panel when dropping top', () => {
      const layout = new Layout({
        child: {
          type: 'panel',
          tabs: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
        },
      })

      const rootPanel = layout.child as Panel
      const tabB = rootPanel.tabs.find(t => t.id === 'b') as Tab

      layout.moveTab(tabB, rootPanel, 'top', 0)

      expect(layout.child instanceof Split).toBe(true)
      const rootSplit = layout.child as Split
      expect(rootSplit.orientation).toBe('vertical')
      expect(rootSplit.children.length).toBe(2)
      expect((rootSplit.children[0] as Panel).tabs[0].id).toBe('b')
      expect(rootSplit.children[1]).toBe(rootPanel)
    })

    it('inherits target panel size when converting to split', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          orientation: 'vertical',
          children: [
            { type: 'panel', tabs: [{ id: 'a', label: 'A' }, { id: 'drag', label: 'Drag' }] },
            { type: 'panel', tabs: [{ id: 'b', label: 'B' }], size: '300px' },
          ],
        },
      })

      const rootSplit = layout.child as Split
      const panelA = rootSplit.children[0] as Panel
      const panelB = rootSplit.children[1] as Panel
      const tab = panelA.tabs.find(t => t.id === 'drag') as Tab

      layout.moveTab(tab, panelB, 'left', 0)

      const bSlot = rootSplit.children[1] as Split
      expect(bSlot.size).toBe('300px')
      expect(panelB.size).toBe(DEFAULT_SIZE)
    })

    it('places new panel first when dropping top on a non-first panel in horizontal split', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          orientation: 'horizontal',
          children: [
            { type: 'panel', tabs: [{ id: 'a', label: 'A' }, { id: 'drag', label: 'Drag' }] },
            { type: 'panel', tabs: [{ id: 'b', label: 'B' }] },
          ],
        },
      })

      const rootSplit = layout.child as Split
      const panelA = rootSplit.children[0] as Panel
      const panelB = rootSplit.children[1] as Panel
      const tab = panelA.tabs.find(t => t.id === 'drag') as Tab

      layout.moveTab(tab, panelB, 'top', 0)

      const bSlot = rootSplit.children[1]
      expect(bSlot instanceof Split).toBe(true)
      const verticalSplit = bSlot as Split
      expect(verticalSplit.orientation).toBe('vertical')
      expect(verticalSplit.children.length).toBe(2)
      expect((verticalSplit.children[0] as Panel).tabs[0].id).toBe('drag')
      expect(verticalSplit.children[1]).toBe(panelB)
    })

  })

  describe('findParentSplit after normalize', () => {

    it('should return live parent after inner split consolidation', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          children: [
            {
              type: 'split',
              size: '350px',
              children: [
                { type: 'panel', tabs: [{ id: 'Inputs' }] },
                { type: 'panel', tabs: [{ id: 'Getting Started' }] },
              ],
            },
            { type: 'panel', tabs: [{ id: 'Theme Editor' }] },
          ],
        },
      })

      const rootSplit = layout.child as Split
      const innerSplit = rootSplit.children[0] as Split
      const panelToEmpty = innerSplit.children[0] as Panel
      const panelSurvivor = innerSplit.children[1] as Panel

      while (panelToEmpty.tabs.length > 0) {
        panelToEmpty.removeTab(panelToEmpty.tabs[0])
      }

      layout.normalize()

      expect(layout.findParentSplit(panelSurvivor)).toBe(rootSplit)
      expect(rootSplit.children.includes(panelSurvivor)).toBe(true)
      expect(splitParents(panelSurvivor)).toEqual([rootSplit])
    })

    it('should return live parent after split-child spread hoisting', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          children: [
            {
              type: 'split',
              children: [
                {
                  type: 'split',
                  children: [
                    {
                      type: 'split',
                      children: [
                        { type: 'panel', tabs: [{ id: 'A' }] },
                        { type: 'panel', tabs: [{ id: 'B' }] },
                      ],
                    },
                  ],
                },
                { type: 'panel', tabs: [{ id: 'C' }] },
              ],
            },
          ],
        },
      })

      layout.normalize()

      const innerSplit = layout.child as Split
      const panelA = innerSplit.children[0] as Panel
      const panelB = innerSplit.children[1] as Panel

      expect(layout.findParentSplit(panelA)).toBe(innerSplit)
      expect(layout.findParentSplit(panelB)).toBe(innerSplit)
      expect(splitParents(panelA)).toEqual([innerSplit])
      expect(splitParents(panelB)).toEqual([innerSplit])
    })

    it('should skip non-Split parents that expose a children collection', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          children: [
            { type: 'panel', tabs: [{ id: 'a' }] },
          ],
        },
      })

      const rootSplit = layout.child as Split
      const panel = rootSplit.children[0] as Panel
      const domLikeParent = { children: document.createElement('div').children }
      panel.addParent(domLikeParent as unknown as Split)

      expect(layout.findParentSplit(panel)).toBe(rootSplit)
    })

    it('should return null after root collapse to lone panel', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          children: [{ type: 'panel', tabs: [{ id: 'solo' }] }],
        },
      })

      layout.normalize()

      const panel = layout.child as Panel

      expect(layout.child instanceof Panel).toBe(true)
      expect(layout.findParentSplit(panel)).toBe(null)
      expect(splitParents(panel).length).toBe(0)
      expect(panel._parents).toContain(layout)
    })

  })

})


function splitParents(panel: Panel): Split[] {
  return panel._parents.filter(p => (p as Split).children !== undefined) as Split[]
}
