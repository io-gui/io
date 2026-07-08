import { test } from 'vitest'
import { ChangeQueue } from './ChangeQueue.js'
import type { Change } from './ChangeQueue.js'
import { BENCH_OPTIONS } from '../testing.js'
import { ReactiveNode } from './ReactiveCore.js'

type BenchOwner = ReactiveNode

function benchOwner(
  handlers: Record<string, (change: Change) => void> = {},
): BenchOwner {
  return {
    dispatch() {},
    mutated() {},
    constructor: { name: 'BenchOwner' },
    ...handlers,
  } as unknown as BenchOwner
}

function freshQueue() {
  return new ChangeQueue(benchOwner())
}

test('ChangeQueue', async ({ bench }) => {
  let q!: ChangeQueue
  let owner!: BenchOwner

  await bench('queue 50 unique', {
    beforeEach: () => {
        q = freshQueue()
    },
  }, () => {
    for (let i = 0; i < 50; i++) {
      q.queue(`p${i}`, i + 1, i)
    }
  }).run(BENCH_OPTIONS)

  await bench('coalesce 1000x', {
    beforeEach: () => {
      q = freshQueue()
    },
  }, () => {
    for (let i = 1; i <= 1000; i++) {
      q.queue('x', i, i - 1)
    }
  }).run(BENCH_OPTIONS)

  await bench('cancel', {
    beforeEach: () => {
      q = freshQueue()
    },
  }, () => {
    q.queue('x', 1, 0)
    q.queue('x', 0, 1)
  }).run(BENCH_OPTIONS)

  await bench('dispatch 50', {
    beforeEach: () => {
      q = freshQueue()
    },
  }, () => {
    for (let i = 0; i < 50; i++) {
      q.queue(`p${i}`, i + 1, i)
    }
    q.dispatch()
  }).run(BENCH_OPTIONS)

  await bench('cascade', {
    beforeEach: () => {
      q = freshQueue()
      owner = benchOwner()
    },
  }, () => {
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
  }).run(BENCH_OPTIONS)

  await bench('coalesce 50 props to final values', {
    beforeEach: () => {
      q = freshQueue()
    },
  }, () => {
    for (let i = 0; i < 50; i++) {
      q.queue(`p${i}`, i + 1, i)
      q.queue(`p${i}`, i + 2, i + 1)
    }
    q.dispatch()
  }).run(BENCH_OPTIONS)
})
