import { test } from 'vitest'
import { ReactiveObject } from '../nodes/ReactiveObject.js'
import { throttle, debounce, clearNodeCallbacks } from './FrameScheduler.js'
import { BENCH_OPTIONS } from '../testing.js'

const noop = () => {}

test('Queue', async ({ bench }) => {
  let node!: ReactiveObject

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
      node = new ReactiveObject()
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
      node = new ReactiveObject()
    },
    afterEach: () => {
      node.dispose()
    },
  }, () => {
    for (let i = 0; i < 500; i++) {
      throttle(noop, i, node)
    }
  }).run(BENCH_OPTIONS)

  await bench('clearNodeCallbacks 500 pending', {
    beforeEach: () => {
      node = new ReactiveObject()
    },
    afterEach: () => {
      node.dispose()
    },
  }, () => {
    for (let i = 0; i < 500; i++) {
      debounce(noop, i, node)
    }
    clearNodeCallbacks(node)
  }).run(BENCH_OPTIONS)

  await bench('mixed debounce and throttle 500', () => {
    for (let i = 0; i < 250; i++) {
      debounce(noop, i)
      throttle(noop, i)
    }
  }).run(BENCH_OPTIONS)
})
