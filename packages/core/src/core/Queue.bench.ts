import { describe } from 'vitest'
import { bench } from '../testing/bench.js'
import { Register } from '../decorators/Register.js'
import { ReactiveNode } from '../nodes/ReactiveNode.js'
import { throttle, debounce, clearNodeQueue } from './Queue.js'

const noop = () => {}

@Register
class BenchQueueNode extends ReactiveNode {}

describe('Queue', () => {
  bench('debounce 500 unique', () => {
    for (let i = 0; i < 500; i++) {
      debounce(noop)
    }
  })

  bench('debounce coalesce 1000x', () => {
    for (let i = 0; i < 1000; i++) {
      debounce(noop, i)
    }
  })

  bench('throttle leading 500 unique', () => {
    for (let i = 0; i < 500; i++) {
      throttle(noop)
    }
  })

  bench('throttle coalesce 1000x', () => {
    for (let i = 0; i < 1000; i++) {
      throttle(noop, i)
    }
  })

  bench('debounce with node 500 unique', () => {
    const node = new BenchQueueNode()
    for (let i = 0; i < 500; i++) {
      debounce(noop, i, node)
    }
    node.dispose()
  })

  bench('throttle with node 500 unique', () => {
    const node = new BenchQueueNode()
    for (let i = 0; i < 500; i++) {
      throttle(noop, i, node)
    }
    node.dispose()
  })

  bench('clearNodeQueue 500 pending', () => {
    const node = new BenchQueueNode()
    for (let i = 0; i < 500; i++) {
      debounce(noop, i, node)
    }
    clearNodeQueue(node)
  })

  bench('mixed debounce and throttle 500', () => {
    for (let i = 0; i < 250; i++) {
      debounce(noop, i)
      throttle(noop, i)
    }
  })
})
