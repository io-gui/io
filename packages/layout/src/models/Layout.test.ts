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

})

function isPanelNode(node: Split | Panel): node is Panel {
  return (node as Panel).tabs !== undefined
}

function isSplitNode(node: Split | Panel): node is Split {
  return (node as Split).children !== undefined
}
