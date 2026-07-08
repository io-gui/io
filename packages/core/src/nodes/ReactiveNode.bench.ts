import { test } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveObject, PropertyDefinitions } from './ReactiveObject.js'
import { BENCH_OPTIONS } from '../testing.js'

@Register
class BenchNode extends ReactiveObject {
  static override get Properties(): PropertyDefinitions {
    const props: PropertyDefinitions = {}
    for (let i = 0; i < 50; i++) {
      props[`p${i}`] = 0
    }
    return props
  }
}

test('ReactiveObject', async ({ bench }) => {
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
