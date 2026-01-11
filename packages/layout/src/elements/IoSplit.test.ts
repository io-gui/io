//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoLayout, Split, Panel, IoSplit, IoPanel } from '@io-gui/layout'

describe('Split Construction Consolidation', () => {
  it('Should consolidate on construction when root has only 1 child that is a Split', () => {
    // This mimics the IoThreeDemo structure where the root Split has only 1 child (a Split)
    const split = new Split({
      type: 'split',
      children: [
        {
          type: 'split',
          orientation: 'horizontal',
          children: [
            {type: 'panel', tabs: [{id: 'panelA'}]},
            {type: 'panel', tabs: [{id: 'panelB'}]},
            {type: 'panel', tabs: [{id: 'panelC'}]}
          ]
        }
      ]
    })

    // After construction, the root should have adopted the child's children and orientation
    expect(split.children.length).toBe(3)
    expect(split.orientation).toBe('horizontal')
    expect(split.children[0]).toBeInstanceOf(Panel)
    expect(split.children[1]).toBeInstanceOf(Panel)
    expect(split.children[2]).toBeInstanceOf(Panel)
  })

  it('Should consolidate nested single-child splits on construction', () => {
    // Multiple levels of single-child splits should all consolidate
    const split = new Split({
      type: 'split',
      children: [
        {
          type: 'split',
          orientation: 'vertical',
          children: [
            {
              type: 'split',
              orientation: 'horizontal',
              children: [
                {type: 'panel', tabs: [{id: 'panelA'}]},
                {type: 'panel', tabs: [{id: 'panelB'}]}
              ]
            }
          ]
        }
      ]
    })

    // Should flatten to just the innermost split's children
    expect(split.children.length).toBe(2)
    expect(split.orientation).toBe('horizontal')
    expect(split.children[0]).toBeInstanceOf(Panel)
    expect(split.children[1]).toBeInstanceOf(Panel)
  })

  it('Should NOT consolidate when root has only 1 child that is a Panel', () => {
    const split = new Split({
      type: 'split',
      children: [
        {type: 'panel', tabs: [{id: 'panelA'}]}
      ]
    })

    // Single panel should remain as-is
    expect(split.children.length).toBe(1)
    expect(split.children[0]).toBeInstanceOf(Panel)
  })

  it('Should NOT consolidate when root has multiple children', () => {
    const split = new Split({
      type: 'split',
      children: [
        {type: 'panel', tabs: [{id: 'panelA'}]},
        {
          type: 'split',
          orientation: 'vertical',
          children: [{type: 'panel', tabs: [{id: 'panelB'}]}]
        }
      ]
    })

    // Multiple children should not trigger consolidation
    expect(split.children.length).toBe(2)
    expect(split.children[0]).toBeInstanceOf(Panel)
    expect(split.children[1]).toBeInstanceOf(Split)
  })

  it('Should consolidate complex IoThreeDemo-like structure', () => {
    // Exact structure from IoThreeDemo
    const split = new Split({
      type: 'split',
      children: [
        {
          type: 'split',
          orientation: 'horizontal',
          children: [
            {
              type: 'panel',
              flex: '1 0 380px',
              tabs: [{id: 'AllClasses'}],
            },
            {
              type: 'split',
              orientation: 'vertical',
              children: [
                {
                  type: 'split',
                  orientation: 'horizontal',
                  children: [
                    {type: 'panel', tabs: [{id: 'Top'}]},
                    {type: 'panel', tabs: [{id: 'Front'}]},
                  ]
                },
                {
                  type: 'split',
                  orientation: 'horizontal',
                  children: [
                    {type: 'panel', tabs: [{id: 'Left'}]},
                    {type: 'panel', tabs: [{id: 'Perspective'}]},
                  ]
                },
              ]
            },
            {
              type: 'panel',
              flex: '1 0 380px',
              tabs: [{id: 'ExampleSelector'}],
            }
          ]
        }
      ]
    })

    // Root should adopt the only child's children and orientation
    expect(split.children.length).toBe(3)
    expect(split.orientation).toBe('horizontal')
    expect(split.children[0]).toBeInstanceOf(Panel)
    expect(split.children[0].flex).toBe('1 0 380px')
    expect(split.children[1]).toBeInstanceOf(Split)
    expect(split.children[2]).toBeInstanceOf(Panel)
  })
})

describe('IoSplit Consolidation', () => {
  let layout
  let container

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (layout) {
      layout.remove()
    }
    container.remove()
  })

  it('Should have consolidateChild method defined', () => {
    const split = new Split({
      type: 'split',
      children: [{type: 'panel', tabs: [{id: 'tab1'}]}]
    })
    layout = new IoLayout({split, elements: []})
    container.appendChild(layout)

    const ioSplit = layout.querySelector('io-split')
    expect(typeof ioSplit.consolidateChild).toBe('function')
  })

  describe('consolidateChild with Panel child', () => {
    it('Should replace child split with its sole panel', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelA'}]},
          {
            type: 'split',
            orientation: 'vertical',
            children: [{type: 'panel', tabs: [{id: 'panelB'}]}]
          }
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const rootSplit = layout.querySelector('io-split')
      const childSplit = split.children[1]

      expect(split.children.length).toBe(2)
      expect(split.children[1]).toBeInstanceOf(Split)

      rootSplit.consolidateChild(childSplit)

      expect(split.children.length).toBe(2)
      expect(split.children[1]).toBeInstanceOf(Panel)
      expect(split.children[1].tabs[0].id).toBe('panelB')
      expect(split.children[1].flex).toBe('1 1 100%')
    })
  })

  describe('consolidateChild with Split child', () => {
    it('Should adopt child split children and orientation', () => {
      // Create a structure where childSplit has 1 child that is a Split with multiple children
      // Note: Since construction-time consolidation now happens, we need to create
      // this structure programmatically after construction
      const innerSplit = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [
          {type: 'panel', tabs: [{id: 'panelB'}]},
          {type: 'panel', tabs: [{id: 'panelC'}]}
        ]
      })

      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelA'}]},
          {type: 'panel', tabs: [{id: 'placeholder'}]}  // Placeholder panel
        ]
      })

      // Replace the placeholder with a split that has only 1 child (a Split)
      const childSplit = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [
          {type: 'panel', tabs: [{id: 'panelB'}]},  // Dummy to prevent construction consolidation
          {type: 'panel', tabs: [{id: 'panelC'}]}
        ]
      })
      // Now manually set it to have only 1 child that is a Split
      childSplit.children.length = 0
      childSplit.children.push(innerSplit)

      split.children[1] = childSplit

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const rootSplit = layout.querySelector('io-split')

      expect(split.children.length).toBe(2)
      expect(childSplit.children.length).toBe(1)
      expect(childSplit.children[0]).toBeInstanceOf(Split)

      rootSplit.consolidateChild(childSplit)

      expect(split.children.length).toBe(3)
      expect(split.orientation).toBe('vertical')
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Panel)
      expect(split.children[2]).toBeInstanceOf(Panel)
      expect(split.children[1].tabs[0].id).toBe('panelB')
      expect(split.children[2].tabs[0].id).toBe('panelC')
    })
  })

  describe('Event-driven consolidation', () => {
    it('Should consolidate via event when dispatched from nested child IoSplit', () => {
      // Structure: root > childSplit (with only 1 child which is a panel)
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelA'}]},
          {
            type: 'split',
            orientation: 'vertical',
            children: [{type: 'panel', tabs: [{id: 'panelB'}]}]
          }
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const childSplit = split.children[1]
      // Find the nested io-split element (second io-split in the DOM)
      const childIoSplit = layout.querySelectorAll('io-split')[1]

      // Dispatch event from child - it should bubble to parent rootSplit
      childIoSplit.dispatchEvent(new CustomEvent('io-split-consolidate', {
        detail: {split: childSplit},
        bubbles: true
      }))

      // Parent should have consolidated the child split into a panel
      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Panel)
      expect(split.children[1].tabs[0].id).toBe('panelB')
    })

    it('Should handle nested split consolidation via event', () => {
      // Structure: root > childSplit (with 1 child which is a Split)
      // Since construction-time consolidation happens, we create this programmatically
      const innerSplit = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelB'}]},
          {type: 'panel', tabs: [{id: 'panelC'}]}
        ]
      })

      const childSplit = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [
          {type: 'panel', tabs: [{id: 'dummy1'}]},
          {type: 'panel', tabs: [{id: 'dummy2'}]}
        ]
      })
      // Replace with single Split child
      childSplit.children.length = 0
      childSplit.children.push(innerSplit)

      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelA'}]},
          {type: 'panel', tabs: [{id: 'placeholder'}]}
        ]
      })
      split.children[1] = childSplit

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      // Find the nested io-split element
      const childIoSplit = layout.querySelectorAll('io-split')[1]

      // Dispatch event from child - it should bubble to parent rootSplit
      childIoSplit.dispatchEvent(new CustomEvent('io-split-consolidate', {
        detail: {split: childSplit},
        bubbles: true
      }))

      // Parent should have adopted grandchild's children and orientation
      expect(split.children.length).toBe(3)
      expect(split.orientation).toBe('horizontal')
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Panel)
      expect(split.children[2]).toBeInstanceOf(Panel)
      expect(split.children[1].tabs[0].id).toBe('panelB')
      expect(split.children[2].tabs[0].id).toBe('panelC')
    })
  })

  describe('Edge cases', () => {
    it('Should preserve flex values when consolidating panels', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelA'}], flex: '0 0 200px'},
          {
            type: 'split',
            orientation: 'vertical',
            children: [{type: 'panel', tabs: [{id: 'panelB'}], flex: '0 0 300px'}]
          }
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const rootSplit = layout.querySelector('io-split')
      const childSplit = split.children[1]

      rootSplit.consolidateChild(childSplit)

      expect(split.children[0].flex).toBe('0 0 200px')
      expect(split.children[1].flex).toBe('1 1 100%')
    })

    it('Should handle consolidation when removing split via io-split-remove', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelA'}]},
          {
            type: 'split',
            orientation: 'vertical',
            children: [{type: 'panel', tabs: [{id: 'panelB'}]}]
          },
          {type: 'panel', tabs: [{id: 'panelC'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      expect(split.children.length).toBe(3)

      const childSplit = split.children[1]
      const rootSplit = layout.querySelector('io-split')

      rootSplit.dispatchEvent(new CustomEvent('io-split-remove', {
        detail: {split: childSplit},
        bubbles: true
      }))

      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Panel)
    })

    it('Should trigger consolidation on split removal if only one child remains (nested)', () => {
      // For consolidation to work via events, we need a grandparent structure
      // root > middleSplit (has childA and childB) > when childA removed, middleSplit consolidates
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'panelRoot'}]},
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              {
                type: 'split',
                orientation: 'horizontal',
                children: [{type: 'panel', tabs: [{id: 'panelA'}]}]
              },
              {
                type: 'split',
                orientation: 'horizontal',
                children: [{type: 'panel', tabs: [{id: 'panelB'}]}]
              }
            ]
          }
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const middleSplit = split.children[1]
      expect(middleSplit.children.length).toBe(2)

      const childSplitToRemove = middleSplit.children[0]

      // Find the grandchild IoSplit element and dispatch from it
      const grandchildIoSplit = layout.querySelectorAll('io-split')[2]

      grandchildIoSplit.dispatchEvent(new CustomEvent('io-split-remove', {
        detail: {split: childSplitToRemove},
        bubbles: true
      }))

      // After removal: middleSplit has 1 child (childB which contains panelB)
      // Consolidation replaces middleSplit in root with childB's contents
      // Root now has: [panelRoot, panelB]
      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[0].tabs[0].id).toBe('panelRoot')
      expect(split.children[1]).toBeInstanceOf(Panel)
      expect(split.children[1].tabs[0].id).toBe('panelB')
    })
  })
})

describe('IoSplit View Element', () => {
  let layout: IoLayout
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (layout) {
      layout.remove()
    }
    container.remove()
  })

  describe('moveTabToSplit', () => {
    it('Should add panel to left when same orientation', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}, {id: 'tab2'}]},
          {type: 'panel', tabs: [{id: 'tab3'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      const sourcePanel = layout.querySelectorAll('io-panel')[0] as IoPanel
      const targetPanel = split.children[0] as Panel
      const tab = split.children[0].tabs[1]

      ioSplit.moveTabToSplit(sourcePanel, targetPanel, tab, 'left')

      expect(split.children.length).toBe(3)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[0].tabs[0].id).toBe('tab2')
    })

    it('Should add panel to right when same orientation', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}, {id: 'tab2'}]},
          {type: 'panel', tabs: [{id: 'tab3'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      const sourcePanel = layout.querySelectorAll('io-panel')[0] as IoPanel
      const targetPanel = split.children[0] as Panel
      const tab = split.children[0].tabs[1]

      ioSplit.moveTabToSplit(sourcePanel, targetPanel, tab, 'right')

      expect(split.children.length).toBe(3)
      expect(split.children[1].tabs[0].id).toBe('tab2')
    })

    it('Should create nested split for perpendicular direction (top)', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}, {id: 'tab2'}]},
          {type: 'panel', tabs: [{id: 'tab3'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      const sourcePanel = layout.querySelectorAll('io-panel')[0] as IoPanel
      const targetPanel = split.children[0] as Panel
      const tab = split.children[0].tabs[1]

      ioSplit.moveTabToSplit(sourcePanel, targetPanel, tab, 'top')

      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Split)
      expect(split.children[0].orientation).toBe('vertical')
    })

    it('Should create nested split for perpendicular direction (bottom)', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}, {id: 'tab2'}]},
          {type: 'panel', tabs: [{id: 'tab3'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      const sourcePanel = layout.querySelectorAll('io-panel')[0] as IoPanel
      const targetPanel = split.children[0] as Panel
      const tab = split.children[0].tabs[1]

      ioSplit.moveTabToSplit(sourcePanel, targetPanel, tab, 'bottom')

      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Split)
      expect(split.children[0].orientation).toBe('vertical')
      expect(split.children[0].children[1].tabs[0].id).toBe('tab2')
    })
  })

  describe('convertToSplit', () => {
    it('Should convert panel to split with two children', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      const panelToConvert = split.children[0] as Panel
      const newPanel1 = new Panel({type: 'panel', tabs: [{id: 'new1'}]})
      const newPanel2 = new Panel({type: 'panel', tabs: [{id: 'new2'}]})

      ioSplit.convertToSplit(panelToConvert, newPanel1, newPanel2, 'vertical')

      expect(split.children[0]).toBeInstanceOf(Split)
      expect(split.children[0].orientation).toBe('vertical')
      expect(split.children[0].children.length).toBe(2)
      expect(split.children[0].children[0].tabs[0].id).toBe('new1')
      expect(split.children[0].children[1].tabs[0].id).toBe('new2')
    })
  })

  describe('ensureFlexGrow', () => {
    it('Should set first child to flex grow when none have it', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}], flex: '0 0 200px'},
          {type: 'panel', tabs: [{id: 'tab2'}], flex: '0 0 300px'}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      ioSplit.ensureFlexGrow()

      expect(split.children[0].flex).toBe('1 1 auto')
    })

    it('Should not change flex when at least one child has flex grow', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}], flex: '0 0 200px'},
          {type: 'panel', tabs: [{id: 'tab2'}], flex: '1 1 100%'}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      ioSplit.ensureFlexGrow()

      expect(split.children[0].flex).toBe('0 0 200px')
      expect(split.children[1].flex).toBe('1 1 100%')
    })
  })

  describe('Rendering', () => {
    it('Should render io-panel for Panel children', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const panels = layout.querySelectorAll('io-panel')
      expect(panels.length).toBe(2)
    })

    it('Should render io-split for Split children', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {
            type: 'split',
            children: [
              {type: 'panel', tabs: [{id: 'tab2'}]},
              {type: 'panel', tabs: [{id: 'tab3'}]}
            ]
          }
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const splits = layout.querySelectorAll('io-split')
      expect(splits.length).toBe(2)
    })

    it('Should render io-divider between children', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]},
          {type: 'panel', tabs: [{id: 'tab3'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const dividers = layout.querySelectorAll('io-divider')
      expect(dividers.length).toBe(2)
    })

    it('Should set orientation attribute', () => {
      const split = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split')
      expect(ioSplit.getAttribute('orientation')).toBe('vertical')
    })
  })

  describe('Static Properties', () => {
    it('Should have Style getter', () => {
      expect(IoSplit.Style).toBeDefined()
      expect(typeof IoSplit.Style).toBe('string')
      expect(IoSplit.Style).toContain(':host')
      expect(IoSplit.Style).toContain('flex-direction')
    })

    it('Should have Listeners getter', () => {
      expect(IoSplit.Listeners).toBeDefined()
      expect(IoSplit.Listeners['io-divider-move']).toBe('onDividerMove')
      expect(IoSplit.Listeners['io-divider-move-end']).toBe('onDividerMoveEnd')
      expect(IoSplit.Listeners['io-panel-remove']).toBe('onPanelRemove')
      expect(IoSplit.Listeners['io-split-remove']).toBe('onSplitRemove')
      expect(IoSplit.Listeners['io-split-consolidate']).toBe('onSplitConsolidate')
    })
  })

  describe('Panel removal via event', () => {
    it('Should remove empty panel and dispatch io-split-remove when all children removed', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      const removeSpy = vi.fn()
      ioSplit.addEventListener('io-split-remove', removeSpy)

      split.children[0].tabs.length = 0

      const ioPanel = layout.querySelector('io-panel') as IoPanel
      ioPanel.dispatchEvent(new CustomEvent('io-panel-remove', {
        detail: {panel: split.children[0]},
        bubbles: true
      }))

      expect(removeSpy).toHaveBeenCalled()
    })

    it('Should dispatch io-split-consolidate when only one child remains', () => {
      const split = new Split({
        type: 'split',
        children: [
          {type: 'panel', tabs: [{id: 'tab1'}]},
          {type: 'panel', tabs: [{id: 'tab2'}]}
        ]
      })

      layout = new IoLayout({split, elements: []})
      container.appendChild(layout)

      const ioSplit = layout.querySelector('io-split') as IoSplit
      const consolidateSpy = vi.fn()
      ioSplit.addEventListener('io-split-consolidate', consolidateSpy)

      split.children[0].tabs.length = 0

      const ioPanel = layout.querySelectorAll('io-panel')[0] as IoPanel
      ioPanel.dispatchEvent(new CustomEvent('io-panel-remove', {
        detail: {panel: split.children[0]},
        bubbles: true
      }))

      expect(consolidateSpy).toHaveBeenCalled()
    })
  })
})
