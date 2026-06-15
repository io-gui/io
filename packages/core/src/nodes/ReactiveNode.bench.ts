import { bench, describe } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveNode, ReactivePropertyDefinitions } from './ReactiveNode.js'

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

describe('ReactiveNode', () => {
  bench('setProperty 50 props', () => {
    const node = new BenchNode()
    for (let i = 0; i < 50; i++) {
      node.setProperty(`p${i}`, i + 1)
    }
    node.dispose()
  })

  bench('setProperties batch 50', () => {
    const node = new BenchNode()
    const props: Record<string, number> = {}
    for (let i = 0; i < 50; i++) {
      props[`p${i}`] = i + 1
    }
    node.setProperties(props)
    node.dispose()
  })
})
