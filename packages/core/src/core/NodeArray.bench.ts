import { test } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveNode, ReactivePropertyDefinitions } from '../nodes/ReactiveNode.js'
import { NodeArray } from './NodeArray.js'
import { BENCH_OPTIONS } from '../testing.js'

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

let parent!: BenchArrayNode
let items!: Array<BenchItemNode>

test('NodeArray', async ({ bench }) => {
  await bench('push x1000', {
    beforeAll: () => {
      parent = new BenchArrayNode()
      items = new Array(1000).fill(0).map((_, i) => new BenchItemNode({n: i}))
    },
    afterAll: () => {
      parent.dispose()
      items.forEach(item => item.dispose())
      items.length = 0
    },
    beforeEach: () => {
      parent.items.splice(0, parent.items.length)
    },
  }, () => {
    for (let i = 0; i < 1000; i++) {
      parent.items.push(items[i])
    }
  }).run(BENCH_OPTIONS)

  await bench('splice(0,1) x1000', {
    beforeAll: () => {
      parent = new BenchArrayNode()
      items = new Array(1000).fill(0).map((_, i) => new BenchItemNode({n: i}))
    },
    afterAll: () => {
      parent.dispose()
      items.forEach(item => item.dispose())
      items.length = 0
    },
    beforeEach: () => {
      parent.items.splice(0, parent.items.length, ...items)
    },
  }, () => {
    for (let i = 0; i < 1000; i++) {
      parent.items.splice(0, 1)
    }
  }).run(BENCH_OPTIONS)
})
