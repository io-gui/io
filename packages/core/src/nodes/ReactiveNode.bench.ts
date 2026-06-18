import { test } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveNode, ReactivePropertyDefinitions } from './ReactiveNode.js'
import { BENCH_OPTIONS } from '../testing.js'

@Register
class BenchNode extends ReactiveNode {
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    const props: ReactivePropertyDefinitions = {}
    for (let i = 0; i < 50; i++) {
      props[`p${i}`] = 0
    }
    return props
  }
}

test('ReactiveNode', async ({ bench }) => {
  await bench('setProperty 50 changed', () => {
    const node = new BenchNode()
    for (let i = 0; i < 50; i++) {
      node.setProperty(`p${i}`, i + 1)
    }
    node.dispose()
  }).run(BENCH_OPTIONS)

  await bench('setProperty 50 unchanged', () => {
    const node = new BenchNode()
    for (let i = 0; i < 50; i++) {
      node.setProperty(`p${i}`, 0)
    }
    node.dispose()
  }).run(BENCH_OPTIONS)

  await bench('setProperties batch 50 changed', () => {
    const node = new BenchNode()
    const props: Record<string, number> = {}
    for (let i = 0; i < 50; i++) {
      props[`p${i}`] = i + 1
    }
    node.setProperties(props)
    node.dispose()
  }).run(BENCH_OPTIONS)

  await bench('setProperties batch 50 unchanged', () => {
    const node = new BenchNode()
    const props: Record<string, number> = {}
    for (let i = 0; i < 50; i++) {
      props[`p${i}`] = 0
    }
    node.setProperties(props)
    node.dispose()
  }).run(BENCH_OPTIONS)
})
