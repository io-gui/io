import { describe, it, expect } from 'vitest'
import { IoSpan, ReactiveNode, Register, ReactivePropertyDefinitions } from '@io-gui/core'

@Register
class LabelNode extends ReactiveNode {
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    return { label: { type: String, value: '' } }
  }
  declare label: string
}

describe('IoSpan', () => {
  it('constructs and sets innerText from value', () => {
    const span = new IoSpan({value: 'hello'})
    expect(span.value).toBe('hello')
    expect(span.innerText).toBe('hello')
    span.dispose()
  })

  it('valueChanged updates innerText', () => {
    const span = new IoSpan({value: 'one'})
    span.value = 'two'
    expect(span.innerText).toBe('two')
    span.dispose()
  })

  it('binds value to source property', () => {
    const source = new LabelNode({label: 'bound'})
    const span = new IoSpan({value: source.bind('label')})
    expect(span.innerText).toBe('bound')
    source.label = 'updated'
    expect(span.innerText).toBe('updated')
    source.dispose()
    span.dispose()
  })
})
