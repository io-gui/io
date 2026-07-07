import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NodeArray } from '@io-gui/core'
import { Split, SplitData, Panel, Layout } from '@io-gui/layout'

describe('Split', () => {

  describe('Construction', () => {

    it('should construct with single panel child', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] }
        ]
      })

      expect(split.children).toBeInstanceOf(NodeArray)
      expect(split.children.length).toBe(1)
      expect(split.children[0]).toBeInstanceOf(Panel)
    })

    it('should construct with multiple panel children', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] },
          { type: 'panel', tabs: [{ id: 'tab2' }] },
          { type: 'panel', tabs: [{ id: 'tab3' }] }
        ]
      })

      expect(split.children.length).toBe(3)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Panel)
      expect(split.children[2]).toBeInstanceOf(Panel)
    })

    it('should construct with nested split children', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] },
          {
            type: 'split',
            children: [
              { type: 'panel', tabs: [{ id: 'tab2' }] },
              { type: 'panel', tabs: [{ id: 'tab3' }] }
            ]
          }
        ]
      })

      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Split)
      expect((split.children[1] as Split).children.length).toBe(2)
    })

    it('should default orientation to horizontal', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      expect(split.orientation).toBe('horizontal')
    })

    it('should accept vertical orientation', () => {
      const split = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      expect(split.orientation).toBe('vertical')
    })

    it('should default size to "auto"', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      expect(split.size).toBe('auto')
    })

    it('should accept custom size value', () => {
      const split = new Split({
        type: 'split',
        size: '400px',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      expect(split.size).toBe('400px')
    })

    it('should preserve child size values', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }], size: '200px' },
          { type: 'panel', tabs: [{ id: 'tab2' }] }
        ]
      })

      expect((split.children[0] as Panel).size).toBe('200px')
      expect((split.children[1] as Panel).size).toBe('auto')
    })

  })

  describe('Mixed Children', () => {

    it('should handle alternating Panel and Split children', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'p1' }] },
          {
            type: 'split',
            children: [
              { type: 'panel', tabs: [{ id: 's1' }] },
              { type: 'panel', tabs: [{ id: 's2' }] }
            ]
          },
          { type: 'panel', tabs: [{ id: 'p2' }] }
        ]
      })

      expect(split.children.length).toBe(3)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Split)
      expect(split.children[2]).toBeInstanceOf(Panel)
    })

    it('should correctly type-check children', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'panel' }] },
          {
            type: 'split',
            children: [{ type: 'panel', tabs: [{ id: 'nested' }] }]
          }
        ]
      })

      const panel = split.children[0]
      const nestedSplit = split.children[1]

      expect(panel instanceof Panel).toBe(true)
      expect(nestedSplit instanceof Split).toBe(true)
      expect(panel instanceof Split).toBe(false)
      expect(nestedSplit instanceof Panel).toBe(false)
    })

  })

  describe('Mutation Events', () => {
    let split: Split
    let mutationHandler: ReturnType<typeof vi.fn>

    beforeEach(() => {
      vi.useFakeTimers()
      split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] },
          { type: 'panel', tabs: [{ id: 'tab2' }] }
        ]
      })
      mutationHandler = vi.fn()
      split.addEventListener('io-mutation', mutationHandler as EventListener)
    })

    afterEach(() => {
      split.dispose()
      vi.useRealTimers()
    })

    it('should dispatch mutation when child added', () => {
      split.children.push(new Panel({
        type: 'panel',
        tabs: [{ id: 'tab3' }]
      }))

      vi.advanceTimersByTime(10)

      expect(mutationHandler).toHaveBeenCalled()
    })

    it('should dispatch mutation when child removed', () => {
      split.children.splice(0, 1)

      vi.advanceTimersByTime(10)

      expect(mutationHandler).toHaveBeenCalled()
    })

    it('should debounce rapid mutations', () => {
      split.children.push(new Panel({ type: 'panel', tabs: [{ id: 't3' }] }))
      split.children.push(new Panel({ type: 'panel', tabs: [{ id: 't4' }] }))
      split.children.pop()

      vi.advanceTimersByTime(10)

      // Should be debounced
      expect(mutationHandler.mock.calls.length).toBeLessThanOrEqual(3)
    })

  })

  describe('Serialization - toJSON', () => {

    it('should serialize simple split with compact output', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] }
        ],
        size: 'auto'
      })

      const json = split.toJSON()

      expect(json.type).toBe('split')
      // Default values are omitted for compact serialization
      expect(json.orientation).toBeUndefined()
      expect(json.size).toBeUndefined()
      expect(json.children).toHaveLength(1)
      expect(json.children[0].type).toBe('panel')
    })

    it('should include non-default orientation in JSON', () => {
      const split = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      const json = split.toJSON()

      expect(json.orientation).toBe('vertical')
    })

    it('should include non-default size in JSON', () => {
      const split = new Split({
        type: 'split',
        size: '300px',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      const json = split.toJSON()

      expect(json.size).toBe('300px')
    })

    it('should serialize nested splits', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'p1' }] },
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              { type: 'panel', tabs: [{ id: 'p2' }] },
              { type: 'panel', tabs: [{ id: 'p3' }] }
            ]
          }
        ]
      })

      const json = split.toJSON()

      expect(json.children.length).toBe(2)
      expect(json.children[0].type).toBe('panel')
      expect(json.children[1].type).toBe('split')
      expect((json.children[1] as SplitData).orientation).toBe('vertical')
      expect((json.children[1] as SplitData).children.length).toBe(2)
    })

    it('should produce plain objects (not instances)', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      const json = split.toJSON()

      expect(json).not.toBeInstanceOf(Split)
      expect(json.children[0]).not.toBeInstanceOf(Panel)
    })

    it('should preserve all child size values', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 't1' }], size: '100px' },
          { type: 'panel', tabs: [{ id: 't2' }] },
          { type: 'panel', tabs: [{ id: 't3' }], size: '200px' }
        ]
      })

      const json = split.toJSON()

      expect(json.children[0].size).toBe('100px')
      expect(json.children[1].size).toBeUndefined()
      expect(json.children[2].size).toBe('200px')
    })

  })

  describe('Deserialization - applyJSON', () => {

    it('should restore split from JSON', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'placeholder' }] }]
      })

      split.applyJSON({
        type: 'split',
        orientation: 'vertical',
        size: '500px',
        children: [
          { type: 'panel', tabs: [{ id: 'restored1' }] },
          { type: 'panel', tabs: [{ id: 'restored2' }] }
        ]
      })

      expect(split.orientation).toBe('vertical')
      expect(split.size).toBe('500px')
      expect(split.children.length).toBe(2)
      expect((split.children[0] as Panel).tabs[0].id).toBe('restored1')
      expect((split.children[1] as Panel).tabs[0].id).toBe('restored2')
    })

    it('should restore nested splits from JSON', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'placeholder' }] }]
      })

      split.applyJSON({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'p1' }] },
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              { type: 'panel', tabs: [{ id: 'p2' }] }
            ]
          }
        ]
      })

      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect(split.children[1]).toBeInstanceOf(Split)
      expect((split.children[1] as Split).orientation).toBe('vertical')
    })

    it('should default orientation when not in JSON', () => {
      const split = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [{ type: 'panel', tabs: [{ id: 'test' }] }]
      })

      split.applyJSON({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'restored' }] }]
      } as SplitData)

      expect(split.orientation).toBe('horizontal')
    })

    it('should default size when not in JSON', () => {
      const split = new Split({
        type: 'split',
        size: '100px',
        children: [{ type: 'panel', tabs: [{ id: 'test' }] }]
      })

      split.applyJSON({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'restored' }] }]
      } as SplitData)

      expect(split.size).toBe('auto')
    })

    it('should return self for chaining', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'test' }] }]
      })

      const result = split.applyJSON({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'chained' }] }]
      })

      expect(result).toBe(split)
    })

  })

  describe('Serialization Roundtrip', () => {

    it('should preserve simple split through roundtrip', () => {
      const original = new Split({
        type: 'split',
        orientation: 'vertical',
        size: '300px',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1', label: 'Tab 1' }] },
          { type: 'panel', tabs: [{ id: 'tab2', selected: true }], size: '100px' }
        ]
      })

      const json = original.toJSON()
      const restored = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'temp' }] }]
      })
      restored.applyJSON(json)

      expect(restored.orientation).toBe(original.orientation)
      expect(restored.size).toBe(original.size)
      expect(restored.children.length).toBe(original.children.length)
    })

    it('should preserve complex nested structure through roundtrip', () => {
      const original = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'sidebar' }], size: '200px' },
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              { type: 'panel', tabs: [{ id: 'main' }] },
              { type: 'panel', tabs: [{ id: 'console' }], size: '150px' }
            ]
          },
          { type: 'panel', tabs: [{ id: 'properties' }], size: '250px' }
        ]
      })

      const json = original.toJSON()
      const restored = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'temp' }] }]
      })
      restored.applyJSON(json)

      // Verify structure
      expect(restored.children.length).toBe(3)
      expect(restored.children[0]).toBeInstanceOf(Panel)
      expect(restored.children[1]).toBeInstanceOf(Split)
      expect(restored.children[2]).toBeInstanceOf(Panel)

      const nestedSplit = restored.children[1] as Split
      expect(nestedSplit.orientation).toBe('vertical')
      expect(nestedSplit.children.length).toBe(2)
    })

    it('should produce identical JSON after roundtrip', () => {
      const original = new Split({
        type: 'split',
        orientation: 'vertical',
        children: [
          { type: 'panel', tabs: [{ id: 't1' }] },
          { type: 'panel', tabs: [{ id: 't2' }] }
        ]
      })

      const json1 = original.toJSON()
      const restored = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'temp' }] }]
      })
      restored.applyJSON(json1)
      const json2 = restored.toJSON()

      expect(json2).toEqual(json1)
    })

  })

  describe('Disposal', () => {

    it('should dispose without error', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] },
          { type: 'panel', tabs: [{ id: 'tab2' }] }
        ]
      })

      expect(() => split.dispose()).not.toThrow()
    })

    it('should clear children array on dispose', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] },
          { type: 'panel', tabs: [{ id: 'tab2' }] }
        ]
      })

      const childrenRef = split.children
      split.dispose()

      expect(childrenRef.length).toBe(0)
    })

    it('should be marked as disposed', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      split.dispose()

      expect(split._disposed).toBe(true)
    })

    it('should cleanup parent-child relationships when children.length set to 0', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'tab1' }] },
          { type: 'panel', tabs: [{ id: 'tab2' }] }
        ]
      })

      const child1 = split.children[0]
      const child2 = split.children[1]

      // Children have split as parent
      expect(child1._parents).toContain(split)
      expect(child2._parents).toContain(split)

      // Clear children via length = 0
      split.children.length = 0

      // Parent relationships are severed
      expect(child1._parents).not.toContain(split)
      expect(child2._parents).not.toContain(split)

      // But children are NOT disposed - still usable
      expect(child1._disposed).toBeUndefined()
      expect(child2._disposed).toBeUndefined()
    })

    it('should dispatch mutation when children cleared via length', () => {
      vi.useFakeTimers()

      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      const mutationHandler = vi.fn()
      split.addEventListener('io-mutation', mutationHandler as EventListener)

      split.children.length = 0

      vi.advanceTimersByTime(10)

      expect(mutationHandler).toHaveBeenCalled()

      vi.useRealTimers()
    })

    it('should dispose nested splits and panels recursively', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'root-panel' }] },
          {
            type: 'split',
            children: [
              { type: 'panel', tabs: [{ id: 'nested1' }] },
              { type: 'panel', tabs: [{ id: 'nested2' }] }
            ]
          }
        ]
      })

      const childrenRef = split.children
      const rootPanel = childrenRef[0] as Panel
      const nestedSplit = childrenRef[1] as Split
      const nestedChildrenRef = nestedSplit.children
      const nestedPanel1 = nestedChildrenRef[0]
      const nestedPanel2 = nestedChildrenRef[1]
      const rootTab = rootPanel.tabs[0]
      const nestedTab1 = (nestedPanel1 as Panel).tabs[0]
      const nestedTab2 = (nestedPanel2 as Panel).tabs[0]

      split.dispose()

      expect(split._disposed).toBe(true)
      expect(childrenRef.length).toBe(0)
      expect(rootPanel._disposed).toBe(true)
      expect(nestedSplit._disposed).toBe(true)
      expect(nestedPanel1._disposed).toBe(true)
      expect(nestedPanel2._disposed).toBe(true)
      expect(rootTab._disposed).toBe(true)
      expect(nestedTab1._disposed).toBe(true)
      expect(nestedTab2._disposed).toBe(true)
    })

  })

  describe('Children Array Operations', () => {

    it('should allow adding children via push', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      split.children.push(new Panel({
        type: 'panel',
        tabs: [{ id: 'tab2' }]
      }))

      expect(split.children.length).toBe(2)
    })

    it('should allow adding nested splits', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }]
      })

      split.children.push(new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'nested' }] }]
      }))

      expect(split.children.length).toBe(2)
      expect(split.children[1]).toBeInstanceOf(Split)
    })

    it('should allow removing children via splice', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 't1' }] },
          { type: 'panel', tabs: [{ id: 't2' }] },
          { type: 'panel', tabs: [{ id: 't3' }] }
        ]
      })

      split.children.splice(1, 1)

      expect(split.children.length).toBe(2)
      expect((split.children[0] as Panel).tabs[0].id).toBe('t1')
      expect((split.children[1] as Panel).tabs[0].id).toBe('t3')
    })

    it('should allow reordering via array operations', () => {
      const split = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'a' }] },
          { type: 'panel', tabs: [{ id: 'b' }] },
          { type: 'panel', tabs: [{ id: 'c' }] }
        ]
      })

      // Move 'c' to first position
      const [removed] = split.children.splice(2, 1)
      split.children.unshift(removed)

      expect((split.children[0] as Panel).tabs[0].id).toBe('c')
      expect((split.children[1] as Panel).tabs[0].id).toBe('a')
      expect((split.children[2] as Panel).tabs[0].id).toBe('b')
    })

  })

  describe('Deep Nesting', () => {

    it('should handle deeply nested structures', () => {
      const split = new Split({
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
                      { type: 'panel', tabs: [{ id: 'deep' }] },
                      { type: 'panel', tabs: [{ id: 'deep2' }] }
                    ]
                  },
                  { type: 'panel', tabs: [{ id: 'level3' }] }
                ]
              },
              { type: 'panel', tabs: [{ id: 'level2' }] }
            ]
          },
          { type: 'panel', tabs: [{ id: 'level1' }] }
        ]
      })

      // Should be constructable without error
      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Split)
    })

    it('should serialize and restore deep nesting', () => {
      const original = new Split({
        type: 'split',
        children: [
          { type: 'panel', tabs: [{ id: 'root' }] },
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              {
                type: 'split',
                orientation: 'horizontal',
                children: [
                  { type: 'panel', tabs: [{ id: 'deep1' }] },
                  { type: 'panel', tabs: [{ id: 'deep2' }] }
                ]
              },
              { type: 'panel', tabs: [{ id: 'mid' }] }
            ]
          }
        ]
      })

      const json = original.toJSON()
      const restored = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'temp' }] }]
      })
      restored.applyJSON(json)

      // Navigate to deepest panel
      const level1 = restored.children[1] as Split
      expect(level1.orientation).toBe('vertical')

      const level2 = level1.children[0] as Split
      expect(level2.orientation).toBe('horizontal')
      expect(level2.children.length).toBe(2)

      const deepPanel = level2.children[0] as Panel
      expect(deepPanel.tabs[0].id).toBe('deep1')
    })

  })

  describe('Edge Cases', () => {

    it('should handle empty children array in construction', () => {

      const split = new Split({
        type: 'split',
        children: []
      })

      expect(split.children.length).toBe(0)
    })

    it('should handle split with many children', () => {
      const children: Array<{ type: 'panel'; tabs: Array<{ id: string }> }> = []
      for (let i = 0; i < 50; i++) {
        children.push({ type: 'panel', tabs: [{ id: `tab${i}` }] })
      }

      const split = new Split({ type: 'split', children })

      expect(split.children.length).toBe(50)
    })

    it('should allow changing orientation after construction', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [{ type: 'panel', tabs: [{ id: 'test' }] }]
      })

      split.orientation = 'vertical'

      expect(split.orientation).toBe('vertical')
    })

    it('should allow changing size after construction', () => {
      const split = new Split({
        type: 'split',
        children: [{ type: 'panel', tabs: [{ id: 'test' }] }]
      })

      split.size = '500px'

      expect(split.size).toBe('500px')
    })

    it('should handle mixed orientation in nested structure', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'left' }] },
          {
            type: 'split',
            orientation: 'vertical',
            children: [
              { type: 'panel', tabs: [{ id: 'top' }] },
              {
                type: 'split',
                orientation: 'horizontal',
                children: [
                  { type: 'panel', tabs: [{ id: 'bottom-left' }] },
                  { type: 'panel', tabs: [{ id: 'bottom-right' }] }
                ]
              }
            ]
          },
          { type: 'panel', tabs: [{ id: 'right' }] }
        ]
      })

      expect(split.orientation).toBe('horizontal')
      expect((split.children[1] as Split).orientation).toBe('vertical')
      expect(((split.children[1] as Split).children[1] as Split).orientation).toBe('horizontal')
    })

  })

  describe('normalize', () => {

    it('should not flip parent orientation when consolidating nested split with siblings', () => {
      const split = new Split({
        type: 'split',
        orientation: 'horizontal',
        children: [
          { type: 'panel', tabs: [{ id: 'A' }] },
          {
            type: 'split',
            children: [
              {
                type: 'split',
                orientation: 'vertical',
                children: [
                  { type: 'panel', tabs: [{ id: 'B' }] },
                  { type: 'panel', tabs: [{ id: 'C' }] },
                ],
              },
            ],
          },
        ],
      })

      split.normalize()

      expect(split.orientation).toBe('horizontal')
      expect(split.children.length).toBe(2)
      expect(split.children[0]).toBeInstanceOf(Panel)
      expect((split.children[0] as Panel).tabs[0].id).toBe('A')
      expect(split.children[1]).toBeInstanceOf(Split)
      const splitS2 = split.children[1] as Split
      expect(splitS2.orientation).toBe('vertical')
      expect(splitS2.children.length).toBe(2)
      expect((splitS2.children[0] as Panel).tabs[0].id).toBe('B')
      expect((splitS2.children[1] as Panel).tabs[0].id).toBe('C')
    })

    it('should transplant split size onto sole panel when consolidating nested split', () => {
      const layout = new Layout({
        child: {
          type: 'split',
          children: [
            {
              type: 'split',
              size: '350px',
              orientation: 'vertical',
              children: [
                {
                  type: 'panel',
                  size: '260px',
                  tabs: [
                    { id: 'Inputs' },
                    { id: 'Sliders' },
                    { id: 'Colors' },
                  ],
                },
                {
                  type: 'panel',
                  tabs: [
                    { id: 'Getting Started' },
                    { id: 'Deep Dive' },
                  ],
                },
              ],
            },
            {
              type: 'split',
              orientation: 'vertical',
              children: [
                { type: 'panel', tabs: [{ id: 'Editors' }] },
                { type: 'panel', size: '280px', tabs: [{ id: 'Icons' }] },
              ],
            },
            {
              type: 'panel',
              size: '330px',
              tabs: [{ id: 'Theme Editor' }],
            },
          ],
        },
      })

      const rootSplit = layout.child as Split
      const innerSplit = rootSplit.children[0] as Split
      const panelToEmpty = innerSplit.children[0] as Panel

      while (panelToEmpty.tabs.length > 0) {
        panelToEmpty.removeTab(panelToEmpty.tabs[0])
      }

      layout.normalize()

      expect(rootSplit.children.length).toBe(3)
      expect(rootSplit.children[0]).toBeInstanceOf(Panel)
      expect((rootSplit.children[0] as Panel).tabs[0].id).toBe('Getting Started')
      expect((rootSplit.children[0] as Panel).size).toBe('350px')
    })

  })

})


