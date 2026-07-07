import { describe, it, expect } from 'vitest'
import { Layout } from './Layout.js'
import { Split, SplitData } from './Split.js'
import { Panel } from './Panel.js'

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

    expect(isSplitNode(layout.child)).toBe(true)
    expect((layout.child as Split).children.length).toBe(2)
  })

  it('should construct with Panel child', () => {
    const layout = new Layout({
      child: {
        type: 'panel',
        tabs: [{ id: 'solo' }],
      },
    })

    expect(isPanelNode(layout.child)).toBe(true)
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
    expect(isSplitNode(restored.child)).toBe(true)
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
    expect(isPanelNode(restored.child)).toBe(true)
    expect((restored.child as Panel).tabs[0].label).toBe('Only Tab')
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

    it('should return null after root collapse to lone panel', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          children: [{ type: 'panel', tabs: [{ id: 'solo' }] }],
        },
      })

      layout.normalize()

      const panel = layout.child as Panel

      expect(isPanelNode(layout.child)).toBe(true)
      expect(layout.findParentSplit(panel)).toBe(null)
      expect(splitParents(panel).length).toBe(0)
      expect(panel._parents).toContain(layout)
    })

  })

})

function isPanelNode(node: Split | Panel): node is Panel {
  return (node as Panel).tabs !== undefined
}

function isSplitNode(node: Split | Panel): node is Split {
  return (node as Split).children !== undefined
}

function splitParents(panel: Panel): Split[] {
  return panel._parents.filter(p => (p as Split).children !== undefined) as Split[]
}
