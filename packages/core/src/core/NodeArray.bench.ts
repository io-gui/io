import { bench, describe } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveNode, ReactivePropertyDefinitions } from '../nodes/ReactiveNode.js'
import { NodeArray } from './NodeArray.js'

@Register
class BenchArrayNode extends ReactiveNode {
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    return {
      items: {type: NodeArray, init: 'this'},
    }
  }
  declare items: NodeArray<BenchItemNode>
}

@Register
class BenchItemNode extends ReactiveNode {
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    return { n: 0 }
  }
}

describe('NodeArray', () => {
  bench('push x1000', () => {
    const parent = new BenchArrayNode()
    for (let i = 0; i < 1000; i++) {
      parent.items.push(new BenchItemNode({n: i}))
    }
    parent.dispose()
  })

  bench('splice(0,1) x1000', () => {
    const parent = new BenchArrayNode()
    for (let i = 0; i < 1000; i++) {
      parent.items.push(new BenchItemNode({n: i}))
    }
    for (let i = 0; i < 1000; i++) {
      parent.items.splice(0, 1)
    }
    parent.dispose()
  })
})
