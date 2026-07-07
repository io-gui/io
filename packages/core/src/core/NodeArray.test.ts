import { describe, it, expect, vi } from 'vitest'
import { ReactiveObject, Register, PropertyDefinitions, NodeArray } from '@io-gui/core'

@Register
class LabelNode extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return {
      label: ''
    }
  }
  declare label: string
  constructor(args?: {label?: string}) { super(args) }
}

@Register
class ScoreNode extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return {
      score: { type: Number, value: 0 },
    }
  }
  declare score: number
  constructor(args?: { score?: number }) { super(args) }
}

@Register
class ItemstNode extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return {
      items: {type: Array, init: null}
    }
  }
  declare items: LabelNode[]
}

@Register
class OwnerNode extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return {items: {type: NodeArray, init: 'this'}}
  }
  declare items: NodeArray<LabelNode>
}

@Register
class ConsumerNode extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return {items: {type: NodeArray, init: 'this'}}
  }
  declare items: NodeArray<LabelNode>
}

@Register
class ContainerNode extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return { items: { type: NodeArray, init: 'this' } }
  }
  declare items: NodeArray<LabelNode>
}

@Register
class GroupNode extends ReactiveObject {
  static get Properties(): PropertyDefinitions {
    return { groups: { type: NodeArray, init: 'this' } }
  }
  declare groups: NodeArray<ContainerNode>
}

describe('NodeArray', () => {
  describe('fill()', () => {
    it('Should fill entire array with a value', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      const fillItem = new LabelNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem)

      expect(array.length).toBe(3)
      expect(array[0]).toBe(fillItem)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)

      parent.dispose()
    })

    it('Should fill from start index to end', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      const fillItem = new LabelNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem, 1)

      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)

      parent.dispose()
    })

    it('Should fill from start to end index', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      const item4 = new LabelNode({label: 'd'})
      const fillItem = new LabelNode({label: 'fill'})

      array.push(item1, item2, item3, item4)

      array.fill(fillItem, 1, 3)

      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)
      expect(array[3]).toBe(item4)

      parent.dispose()
    })

    it('Should handle negative start index', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      const fillItem = new LabelNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem, -2)

      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(fillItem)

      parent.dispose()
    })

    it('Should handle negative end index', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      const fillItem = new LabelNode({label: 'fill'})

      array.push(item1, item2, item3)

      array.fill(fillItem, 0, -1)

      expect(array[0]).toBe(fillItem)
      expect(array[1]).toBe(fillItem)
      expect(array[2]).toBe(item3)

      parent.dispose()
    })

    it('Should remove listeners from old items and add to new item', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const fillItem = new LabelNode({label: 'fill'})

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
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const fillItem = new LabelNode({label: 'fill'})

      array.push(item1)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.fill(fillItem)

      expect(handler).toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })

    it('Should not dispatch mutation when filling empty range', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const fillItem = new LabelNode({label: 'fill'})

      array.push(item1)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.fill(fillItem, 2, 2)

      expect(handler).not.toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })
  })

  describe('copyWithin()', () => {
    it('Should copy elements within the array', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      const item4 = new LabelNode({label: 'd'})

      array.push(item1, item2, item3, item4)

      array.copyWithin(0, 2)

      expect(array[0].label).toBe('c')
      expect(array[1].label).toBe('d')
      expect(array[2].label).toBe('c')
      expect(array[3].label).toBe('d')

      parent.dispose()
    })

    it('Should copy elements with start and end indices', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      const item4 = new LabelNode({label: 'd'})
      const item5 = new LabelNode({label: 'e'})

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
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})

      array.push(item1, item2, item3)

      array.copyWithin(-2, 0, 1)

      expect(array[0].label).toBe('a')
      expect(array[1].label).toBe('a')
      expect(array[2].label).toBe('c')

      parent.dispose()
    })

    it('Should handle negative start index', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})

      array.push(item1, item2, item3)

      array.copyWithin(0, -2)

      expect(array[0].label).toBe('b')
      expect(array[1].label).toBe('c')
      expect(array[2].label).toBe('c')

      parent.dispose()
    })

    it('Should update parent relationships correctly', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})

      array.push(item1, item2)

      expect(item1._parents.includes(parent)).toBe(true)
      expect(item2._parents.includes(parent)).toBe(true)

      array.copyWithin(0, 1)

      expect(item1._parents.includes(parent)).toBe(false)
      expect(item2._parents.includes(parent)).toBe(true)

      parent.dispose()
    })

    it('Should dispatch mutation event', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})

      array.push(item1, item2)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.copyWithin(0, 1)

      expect(handler).toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })

    it('Should not copy when count is zero', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})

      array.push(item1, item2)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.copyWithin(0, 1, 1)

      expect(handler).not.toHaveBeenCalled()
      expect(array[0].label).toBe('a')
      expect(array[1].label).toBe('b')

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })
  })

  describe('push()', () => {
    it('Should push items and add parent relationships', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item = new LabelNode({label: 'test'})

      array.push(item)

      expect(array.length).toBe(1)
      expect(array[0]).toBe(item)
      expect(item._parents.includes(parent)).toBe(true)

      parent.dispose()
    })
  })

  describe('pop()', () => {
    it('Should pop items and remove parent relationships', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item = new LabelNode({label: 'test'})

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
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})

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

    it('Should detach nested children when removing container from NodeArray', () => {
      const parent = new GroupNode()
      const container = new ContainerNode()
      const leaf = new LabelNode({ label: 'leaf' })
      container.items.push(leaf)
      parent.groups.push(container)

      expect(leaf._parents.includes(container)).toBe(true)

      const replacement = new ContainerNode()
      parent.groups.splice(0, 1, replacement)

      expect(leaf._parents.includes(container)).toBe(false)
      expect(container._parents.includes(parent)).toBe(false)
      expect(replacement._parents.includes(parent)).toBe(true)

      parent.dispose()
    })
  })

  describe('reverse()', () => {
    it('Should reverse array and dispatch mutation', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})

      array.push(item1, item2)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.reverse()

      expect(array[0]).toBe(item2)
      expect(array[1]).toBe(item1)
      expect(handler).toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })
  })

  describe('sort()', () => {
    it('Should sort array and dispatch mutation', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'b'})
      const item2 = new LabelNode({label: 'a'})

      array.push(item1, item2)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.sort((a, b) => a.label.localeCompare(b.label))

      expect(array[0]).toBe(item2)
      expect(array[1]).toBe(item1)
      expect(handler).toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })
  })

  describe('toJSON and applyJSON', () => {
    it('serializes each item via toJSON', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<ScoreNode>(parent)
      const item1 = new ScoreNode({ score: 1 })
      const item2 = new ScoreNode({ score: 2 })
      array.push(item1, item2)

      expect(array.toJSON()).toEqual([
        { score: 1 },
        { score: 2 },
      ])

      parent.dispose()
    })

    it('applyJSON updates existing items in place', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<ScoreNode>(parent)
      const item1 = new ScoreNode({ score: 1 })
      const item2 = new ScoreNode({ score: 2 })
      array.push(item1, item2)

      array.applyJSON([{ score: 10 }, { score: 20 }])

      expect(array[0].score).toBe(10)
      expect(array[1].score).toBe(20)
      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(item2)

      parent.dispose()
    })

    it('round-trips through parent node applyJSON', () => {
      @Register
      class ItemsNode extends ReactiveObject {
        static get Properties(): PropertyDefinitions {
          return {
            items: { type: NodeArray, init: 'this' },
          }
        }
        declare items: NodeArray<ScoreNode>
      }

      const parent = new ItemsNode()
      parent.items.push(new ScoreNode({ score: 1 }), new ScoreNode({ score: 2 }))

      const json = parent.toJSON()
      parent.applyJSON(json)

      expect(parent.items[0].score).toBe(1)
      expect(parent.items[1].score).toBe(2)
      parent.dispose()
    })
  })

  describe('array assignment', () => {
    it('replaces items without duplicate mutation listeners when keeping existing items', () => {
      @Register
      class ItemsNode extends ReactiveObject {
        static get Properties(): PropertyDefinitions {
          return {
            items: { type: NodeArray, init: 'this' },
          }
        }
        declare items: NodeArray<ScoreNode>
      }

      const parent = new ItemsNode()
      const item1 = new ScoreNode({ score: 1 })
      const item2 = new ScoreNode({ score: 2 })
      const item3 = new ScoreNode({ score: 3 })
      parent.items.push(item1, item2, item3)

      parent.setProperty('items', [item1, item3])

      expect(parent.items.length).toBe(2)
      expect(parent.items[0]).toBe(item1)
      expect(parent.items[1]).toBe(item3)
      expect(item1._eventDispatcher.addedListeners['io-mutation']?.length).toBe(1)
      expect(item3._eventDispatcher.addedListeners['io-mutation']?.length).toBe(1)
      expect(item2._eventDispatcher.addedListeners['io-mutation']).toBeUndefined()

      parent.dispose()
    })
  })

  describe('constructor', () => {
    it('accepts prefilled items', () => {
      const parent = new ItemstNode()
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const array = new NodeArray<LabelNode>(parent, item1, item2)

      expect(array.length).toBe(2)
      expect(array[0]).toBe(item1)
      expect(array[1]).toBe(item2)

      parent.dispose()
    })
  })

  describe('dispose()', () => {
    it('Should not dispatch mutation during dispose', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      array.push(new LabelNode({label: 'a'}))

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.dispose()

      expect(handler).not.toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })

    it('Should clear items, remove parent links', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})

      array.push(item1, item2)

      expect(item1._parents.includes(parent)).toBe(true)
      expect(item2._parents.includes(parent)).toBe(true)
      expect(item1._eventDispatcher.addedListeners['io-mutation']?.length).toBe(1)
      expect(item2._eventDispatcher.addedListeners['io-mutation']?.length).toBe(1)

      array.dispose()

      expect(array.length).toBe(0)

      parent.dispose()
    })

    it('Should clear observers so owner no longer receives mutations', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item = new LabelNode({label: 'a'})
      array.push(item)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.pop()
      expect(handler).toHaveBeenCalledTimes(1)

      array.dispose()
      handler.mockClear()

      const item2 = new LabelNode({label: 'b'})
      array.push(item2)
      expect(handler).not.toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
      item.dispose()
      item2.dispose()
    })

    it('Should not dispose shared NodeArray when a borrowing node is disposed', () => {
      // Regression: drawer io-tabs disposal must not wipe panel.tabs still owned by Panel.
      const owner = new OwnerNode()
      owner.items.push(new LabelNode({label: 'a'}))

      const consumer = new ConsumerNode()
      consumer.setProperty('items', owner.items)
      consumer.dispose()

      expect(owner.items.length).toBe(1)
      expect(owner.items[0].label).toBe('a')

      owner.dispose()
    })

    it('Should clear additional observers', () => {
      const parent = new ItemstNode()
      const observer = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      array.addObserver(observer)

      const handler = vi.fn()
      observer.addEventListener('io-mutation', handler)

      const item = new LabelNode({label: 'a'})
      array.push(item)
      expect(handler).toHaveBeenCalledTimes(1)

      array.dispose()
      handler.mockClear()

      const item2 = new LabelNode({label: 'b'})
      array.push(item2)
      expect(handler).not.toHaveBeenCalled()

      parent.dispose()
      observer.dispose()
      item2.dispose()
    })

    it('Should dispose items when deep is true (default)', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      array.push(item1, item2)

      array.dispose()

      expect(item1._disposed).toBe(true)
      expect(item2._disposed).toBe(true)

      parent.dispose()
    })

    it('Should not dispose items when deep is false', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item = new LabelNode({label: 'a'})
      array.push(item)

      array.dispose(false)

      expect(array.length).toBe(0)
      expect(item._disposed).toBeUndefined()

      parent.dispose()
      item.dispose()
    })
  })

  describe('withInternalOperation()', () => {

    it('Should coalesce dispatches from method mutators into a single io-mutation', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      array.push(item1, item2, item3)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.withInternalOperation(() => {
        array.splice(1, 1)
        array.splice(0, 1, new LabelNode({label: 'x'}))
      })

      expect(handler).toHaveBeenCalledTimes(1)

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })

    it('Should preserve suppression through nested withInternalOperation', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      const item3 = new LabelNode({label: 'c'})
      array.push(item1, item2, item3)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.withInternalOperation(() => {
        array.withInternalOperation(() => {
          array.splice(0, 1)
        })
        array.splice(1, 1)
      })

      expect(handler).toHaveBeenCalledTimes(1)

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })

    it('Should suppress proxy-trap dispatch until the outermost batch completes', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      const item1 = new LabelNode({label: 'a'})
      const item2 = new LabelNode({label: 'b'})
      array.push(item1, item2)

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.withInternalOperation(() => {
        array[0] = new LabelNode({label: 'x'})
        array.withInternalOperation(() => {
          array[1] = new LabelNode({label: 'y'})
        })
      })

      expect(handler).toHaveBeenCalledTimes(1)

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })

    it('Should not dispatch when an internal batch makes no mutations', () => {
      const parent = new ItemstNode()
      const array = new NodeArray<LabelNode>(parent)
      array.push(new LabelNode({label: 'a'}))

      const handler = vi.fn()
      parent.addEventListener('io-mutation', handler)

      array.withInternalOperation(() => {
        array.withInternalOperation(() => {})
      })

      expect(handler).not.toHaveBeenCalled()

      parent.removeEventListener('io-mutation', handler)
      parent.dispose()
    })

  })
})

