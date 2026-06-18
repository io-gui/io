import { test } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveNode, ReactivePropertyDefinitions } from '../nodes/ReactiveNode.js'
import { Binding } from './Binding.js'
import { BENCH_OPTIONS } from '../testing.js'

const BINDING_COUNT = 500
const TARGET_COUNT = 10

@Register
class BenchBindingNode extends ReactiveNode {
  declare source: number
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    const props: ReactivePropertyDefinitions = { source: 0 }
    for (let i = 0; i < TARGET_COUNT; i++) {
      props[`t${i}`] = 0
    }
    return props
  }
}

let source!: BenchBindingNode
let targets!: BenchBindingNode[][]
let bindings!: Binding[]

test('Binding', async ({ bench }) => {
  await bench(
    `create ${BINDING_COUNT} bindings`,
    () => {
      const source = new BenchBindingNode()
      const bindings: Binding[] = []
      for (let i = 0; i < BINDING_COUNT; i++) {
        bindings.push(new Binding(source, 'source'))
      }
      for (const binding of bindings) binding.dispose()
      source.dispose()
    },
  ).run(BENCH_OPTIONS)

  await bench(
    `dispose ${BINDING_COUNT} bindings`,
    () => {
      const source = new BenchBindingNode()
      const bindings: Binding[] = []
      for (let i = 0; i < BINDING_COUNT; i++) {
        bindings.push(new Binding(source, 'source'))
      }
      for (let i = 0; i < BINDING_COUNT; i++) {
        bindings[i].dispose()
      }
      source.dispose()
    },
  ).run(BENCH_OPTIONS)

  await bench(
    `bind ${BINDING_COUNT} bindings to ${TARGET_COUNT} targets`,
    {
      beforeAll: () => {
        source = new BenchBindingNode()
        targets = []
        for (let i = 0; i < BINDING_COUNT; i++) {
          const group: BenchBindingNode[] = []
          for (let t = 0; t < TARGET_COUNT; t++) {
            group.push(new BenchBindingNode())
          }
          targets.push(group)
        }
      },
      beforeEach: () => {
        bindings = []
        for (let i = 0; i < BINDING_COUNT; i++) {
          bindings.push(new Binding(source, 'source'))
        }
      },
      afterEach: () => {
        for (const binding of bindings) binding.dispose()
        bindings.length = 0
      },
      afterAll: () => {
        for (const group of targets) {
          for (const target of group) target.dispose()
        }
        targets.length = 0
        source.dispose()
      },
    },
    () => {
      for (let i = 0; i < BINDING_COUNT; i++) {
        for (let t = 0; t < TARGET_COUNT; t++) {
          bindings[i].addTarget(targets[i][t], `t${t}`)
        }
      }
    },
  ).run(BENCH_OPTIONS)
})
