import { bench, describe } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveNode } from '../nodes/ReactiveNode.js'

@Register
class BenchChainNode extends ReactiveNode {}

describe('EventDispatcher', () => {
  bench('synthetic dispatch depth 20', () => {
    const nodes: BenchChainNode[] = []
    for (let i = 0; i < 20; i++) {
      const node = new BenchChainNode()
      if (i > 0) node.addParent(nodes[i - 1])
      nodes.push(node)
    }
    nodes[19]._eventDispatcher.dispatchEvent('bench-event', 1, true)
    for (const node of nodes) node.dispose()
  })
})
