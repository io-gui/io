import { bench, describe } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveNode, ReactivePropertyDefinitions } from '../nodes/ReactiveNode.js'
import { Binding } from './Binding.js'

@Register
class BenchBindingNode extends ReactiveNode {
  declare source: number
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    const props: ReactivePropertyDefinitions = { source: 0 }
    for (let i = 0; i < 16; i++) {
      props[`t${i}`] = 0
    }
    return props
  }
}

describe('Binding', () => {
  bench('1 source to 16 targets', () => {
    const source = new BenchBindingNode()
    const binding = new Binding(source, 'source')
    const targets: BenchBindingNode[] = []
    for (let i = 0; i < 16; i++) {
      const target = new BenchBindingNode()
      targets.push(target)
      binding.addTarget(target, `t${i}`)
    }
    source.source = 42
    source.dispose()
    for (const target of targets) target.dispose()
  })
})
