import { test } from 'vitest'
import { ReactiveNode } from '../nodes/ReactiveNode.js'
import { throttle, debounce, clearNodeQueue } from './Queue.js'
import { BENCH_OPTIONS } from '../testing.js'

const noop = () => {}

test('Queue', async ({ bench }) => {
  let node!: ReactiveNode

  await bench('debounce 500 unique', () => {
    for (let i = 0; i < 500; i++) {
      debounce(noop)
    }
  }).run(BENCH_OPTIONS)

  await bench('debounce coalesce 1000x', () => {
    for (let i = 0; i < 1000; i++) {
      debounce(noop, i)
    }
  }).run(BENCH_OPTIONS)

  await bench('throttle leading 500 unique', () => {
    for (let i = 0; i < 500; i++) {
      throttle(noop)
    }
  }).run(BENCH_OPTIONS)

  await bench('throttle coalesce 1000x', () => {
    for (let i = 0; i < 1000; i++) {
      throttle(noop, i)
    }
  }).run(BENCH_OPTIONS)

  await bench('debounce with node 500 unique', {
    beforeEach: () => {
      node = new ReactiveNode()
    },
    afterEach: () => {
      node.dispose()
    },
  }, () => {
    for (let i = 0; i < 500; i++) {
      debounce(noop, i, node)
    }
  }).run(BENCH_OPTIONS)

  await bench('throttle with node 500 unique', {
    beforeEach: () => {
      node = new ReactiveNode()
    },
    afterEach: () => {
      node.dispose()
    },
  }, () => {
    for (let i = 0; i < 500; i++) {
      throttle(noop, i, node)
    }
  }).run(BENCH_OPTIONS)

  await bench('clearNodeQueue 500 pending', {
    beforeEach: () => {
      node = new ReactiveNode()
    },
    afterEach: () => {
      node.dispose()
    },
  }, () => {
    for (let i = 0; i < 500; i++) {
      debounce(noop, i, node)
    }
    clearNodeQueue(node)
  }).run(BENCH_OPTIONS)

  await bench('mixed debounce and throttle 500', () => {
    for (let i = 0; i < 250; i++) {
      debounce(noop, i)
      throttle(noop, i)
    }
  }).run(BENCH_OPTIONS)
})
