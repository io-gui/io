import { describe } from 'vitest'
import { bench } from '../testing/bench.js'
import { ChangeQueue } from './ChangeQueue.js'
import type { Change } from './ChangeQueue.js'
import type { ReactiveNode } from '../nodes/ReactiveNode.js'
import type { IoElement } from '../elements/IoElement.js'

type BenchOwner = ReactiveNode | IoElement

function benchOwner(
  handlers: Record<string, (change: Change) => void> = {},
): BenchOwner {
  return {
    dispatch() {},
    changed() {},
    constructor: { name: 'BenchOwner' },
    ...handlers,
  } as unknown as BenchOwner
}

function freshQueue() {
  return new ChangeQueue(benchOwner())
}

describe('ChangeQueue', () => {
  bench('queue 50 unique', () => {
    const q = freshQueue()
    for (let i = 0; i < 50; i++) {
      q.queue(`p${i}`, i + 1, i)
    }
  })

  bench('coalesce 1000x', () => {
    const q = freshQueue()
    for (let i = 1; i <= 1000; i++) {
      q.queue('x', i, i - 1)
    }
  })

  bench('cancel', () => {
    const q = freshQueue()
    q.queue('x', 1, 0)
    q.queue('x', 0, 1)
  })

  bench('dispatch 50', () => {
    const q = freshQueue()
    for (let i = 0; i < 50; i++) {
      q.queue(`p${i}`, i + 1, i)
    }
    q.dispatch()
  })

  bench('cascade', () => {
    const owner = benchOwner()
    const q = new ChangeQueue(owner)
    Object.assign(owner, {
      prop1Changed(change: Change) {
        if (change.value === 1) {
          q.queue('prop2', 'cascaded', '')
        }
      },
      prop2Changed(change: Change) {
        if (change.value === 'cascaded') {
          q.queue('prop3', 'final', '')
        }
      },
      prop3Changed() {},
    })
    q.queue('prop1', 1, 0)
    q.dispatch()
  })

  bench('coalesce 50 props to final values', () => {
    const q = freshQueue()
    for (let i = 0; i < 50; i++) {
      q.queue(`p${i}`, i + 1, i)
      q.queue(`p${i}`, i + 2, i + 1)
    }
    q.dispatch()
  })
})
