import { describe, it, expect, vi } from 'vitest'
import { Node, Register, ReactivePropertyDefinitions } from '@io-gui/core'
import { NodeArray } from './NodeArray.js'

@Register
class TestNode extends Node {
  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {
      label: ''
    }
  }
  declare label: string
  constructor(args?: {label?: string}) { super(args) }
}

@Register
class ParentNode extends Node {
  static get ReactiveProperties(): ReactivePropertyDefinitions {
    return {
      items: {type: Array, init: null}
    }
  }
  declare items: TestNode[]
}

describe('NodeArray', () => {
  describe('fill()', () => {
    it('Should fill entire array with a value', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem)

      expect(array.length).toBe(3)
      expect(array[0]).toBe(fillItem)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)

      parent.dispose()
    })

    it('Should fill from start index to end', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem, 1)

      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)

      parent.dispose()
    })

    it('Should fill from start to end index', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})
      const item4 = new TestNode({label: 'd'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1, item2, item3, item4)

      array.fill(fillItem, 1, 3)

      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)
      expect(array[3]).toBe(item4)

      parent.dispose()
    })

    it('Should handle negative start index', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem, -2)

      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)

      parent.dispose()
    })

    it('Should handle negative end index', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem, 0, -1)

      expect(array[0]).toBe(fillItem)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(item3)

      parent.dispose()
    })

    it('Should remove listeners from old items and add to new item', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1, item2)

      expect(item1._parents.includes(parent)).toBe(true)
      expect(item2._parents.includes(parent)).toBe(true)

      array.fill(fillItem)

      expect(item1._parents.includes(parent)).toBe(false)
      expect(item2._parents.includes(parent)).toBe(false)
      expect(fillItem._parents.includes(parent)).toBe(true)

      parent.dispose()
    })

    it('Should dispatch mutation event', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1)

      const handler = vi.fn()
      window.addEventListener('io-object-mutation', handler)

      array.fill(fillItem)

      expect(handler).toHaveBeenCalled()

      window.removeEventListener('io-object-mutation', handler)
      parent.dispose()
    })

    it('Should not dispatch mutation when filling empty range', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const fillItem = new TestNode({label: 'fill'})

      array.push(item1)

      const handler = vi.fn()
      window.addEventListener('io-object-mutation', handler)

      array.fill(fillItem, 2, 2)

      expect(handler).not.toHaveBeenCalled()

      window.removeEventListener('io-object-mutation', handler)
      parent.dispose()
    })
  })

  describe('copyWithin()', () => {
    it('Should copy elements within the array', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})
      const item4 = new TestNode({label: 'd'})

      array.push(item1, item2, item3, item4)

      array.copyWithin(0, 2)

      expect(array[0].label).toBe('c')
      expect(array[1].label).toBe('d')
      expect(array[2].label).toBe('c')
      expect(array[3].label).toBe('d')

      parent.dispose()
    })

    it('Should copy elements with start and end indices', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})
      const item4 = new TestNode({label: 'd'})
      const item5 = new TestNode({label: 'e'})

      array.push(item1, item2, item3, item4, item5)

      array.copyWithin(0, 3, 4)

      expect(array[0].label).toBe('d')
      expect(array[1].label).toBe('b')
      expect(array[2].label).toBe('c')
      expect(array[3].label).toBe('d')
      expect(array[4].label).toBe('e')

      parent.dispose()
    })

    it('Should handle negative target index', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})

      array.push(item1, item2, item3)

      array.copyWithin(-2, 0, 1)

      expect(array[0].label).toBe('a')
      expect(array[1].label).toBe('a')
      expect(array[2].label).toBe('c')

      parent.dispose()
    })

    it('Should handle negative start index', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})

      array.push(item1, item2, item3)

      array.copyWithin(0, -2)

      expect(array[0].label).toBe('b')
      expect(array[1].label).toBe('c')
      expect(array[2].label).toBe('c')

      parent.dispose()
    })

    it('Should update parent relationships correctly', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})

      array.push(item1, item2)

      expect(item1._parents.includes(parent)).toBe(true)
      expect(item2._parents.includes(parent)).toBe(true)

      array.copyWithin(0, 1)

      expect(item1._parents.includes(parent)).toBe(false)
      expect(item2._parents.includes(parent)).toBe(true)

      parent.dispose()
    })

    it('Should dispatch mutation event', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})

      array.push(item1, item2)

      const handler = vi.fn()
      window.addEventListener('io-object-mutation', handler)

      array.copyWithin(0, 1)

      expect(handler).toHaveBeenCalled()

      window.removeEventListener('io-object-mutation', handler)
      parent.dispose()
    })

    it('Should not copy when count is zero', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})

      array.push(item1, item2)

      const handler = vi.fn()
      window.addEventListener('io-object-mutation', handler)

      array.copyWithin(0, 1, 1)

      expect(handler).not.toHaveBeenCalled()
      expect(array[0].label).toBe('a')
      expect(array[1].label).toBe('b')

      window.removeEventListener('io-object-mutation', handler)
      parent.dispose()
    })
  })

  describe('push()', () => {
    it('Should push items and add parent relationships', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item = new TestNode({label: 'test'})

      array.push(item)

      expect(array.length).toBe(1)
      expect(array[0]).toBe(item)
      expect(item._parents.includes(parent)).toBe(true)

      parent.dispose()
    })
  })

  describe('pop()', () => {
    it('Should pop items and remove parent relationships', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item = new TestNode({label: 'test'})

      array.push(item)
      const popped = array.pop()

      expect(array.length).toBe(0)
      expect(popped).toBe(item)
      expect(item._parents.includes(parent)).toBe(false)

      parent.dispose()
    })
  })

  describe('splice()', () => {
    it('Should splice items and update parent relationships', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})
      const item3 = new TestNode({label: 'c'})

      array.push(item1, item2)
      array.splice(1, 1, item3)

      expect(array.length).toBe(2)
      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(item3)
      expect(item1._parents.includes(parent)).toBe(true)
      expect(item2._parents.includes(parent)).toBe(false)
      expect(item3._parents.includes(parent)).toBe(true)

      parent.dispose()
    })
  })

  describe('reverse()', () => {
    it('Should reverse array and dispatch mutation', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'a'})
      const item2 = new TestNode({label: 'b'})

      array.push(item1, item2)
      
      const handler = vi.fn()
      window.addEventListener('io-object-mutation', handler)

      array.reverse()

      expect(array[0]).toBe(item2)
      expect(array[1]).toBe(item1)
      expect(handler).toHaveBeenCalled()

      window.removeEventListener('io-object-mutation', handler)
      parent.dispose()
    })
  })

  describe('sort()', () => {
    it('Should sort array and dispatch mutation', () => {
      const parent = new ParentNode()
      const array = new NodeArray<TestNode>(parent)
      const item1 = new TestNode({label: 'b'})
      const item2 = new TestNode({label: 'a'})

      array.push(item1, item2)

      const handler = vi.fn()
      window.addEventListener('io-object-mutation', handler)

      array.sort((a, b) => a.label.localeCompare(b.label))

      expect(array[0]).toBe(item2)
      expect(array[1]).toBe(item1)
      expect(handler).toHaveBeenCalled()

      window.removeEventListener('io-object-mutation', handler)
      parent.dispose()
    })
  })
})

