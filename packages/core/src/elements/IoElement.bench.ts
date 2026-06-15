import { describe } from 'vitest'
import { bench } from '../testing/bench.js'
import { Register } from '../decorators/Register.js'
import { IoElement } from './IoElement.js'
import { div } from './IoNative.js'
import { VDOMElement } from '../vdom/VDOM.js'

@Register
class BenchRenderElement extends IoElement {
  renderNodes(changed = 0) {
    const nodes: VDOMElement[] = []
    for (let i = 0; i < 200; i++) {
      nodes.push(div({key: i, class: i < changed ? 'changed' : 'same'}))
    }
    this.render(nodes)
  }
}

describe('IoElement', () => {
  bench('render 200 div nodes', () => {
    const el = new BenchRenderElement()
    el.renderNodes()
    el.dispose()
  })

  bench('re-render 200 unchanged', () => {
    const el = new BenchRenderElement()
    el.renderNodes()
    el.renderNodes(0)
    el.dispose()
  })

  bench('re-render 10 changed', () => {
    const el = new BenchRenderElement()
    el.renderNodes()
    el.renderNodes(10)
    el.dispose()
  })
})
