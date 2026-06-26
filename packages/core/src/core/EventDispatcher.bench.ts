import { test } from 'vitest'
import { ReactiveObject } from '../nodes/ReactiveObject.js'
import { BENCH_OPTIONS } from '../testing.js'

test('EventDispatcher', async ({ bench }) => {
  let nodes!: Array<ReactiveObject>

  await bench('synthetic dispatch depth 20', {
    beforeAll: () => {
      nodes = new Array(20).fill(0).map(() => new ReactiveObject())
      for (let i = 0; i < 20; i++) {
        nodes[i].addParent(nodes[i - 1])
      }
    },
    afterAll: () => {
      nodes.forEach(node => node.dispose())
      nodes.length = 0
    },
  }, () => {
    nodes[19]._eventDispatcher.dispatchEvent('bench-event', 1, true)
  }).run(BENCH_OPTIONS)
})
