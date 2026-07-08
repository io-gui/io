import { test } from 'vitest'
import { Register } from '../decorators/Register.js'
import { ReactiveElement } from './ReactiveElement.js'
import { div, span } from './IoNative.js'
import { text, VDOMElement } from '../vdom/VDOM.js'
import { BENCH_OPTIONS } from '../testing.js'

@Register
class BenchRenderElement extends ReactiveElement {
  renderNodes(changed = 0) {
    const nodes: VDOMElement[] = []
    for (let i = 0; i < 200; i++) {
      nodes.push(div({key: i, class: i < changed ? 'changed' : 'same'}))
    }
    this.render(nodes)
  }
}

test('ReactiveElement', async ({ bench }) => {
  let el!: ReactiveElement
  let vdomNodes!: Array<VDOMElement>
  await bench('render 200 div nodes', {
    beforeEach: () => {
      el = new BenchRenderElement()
      vdomNodes = new Array(200).fill(0).map((_, i) => div({key: i}))
    },
    afterEach: () => {
      el.dispose()
      vdomNodes.length = 0
    },
  }, () => {
    el.render(vdomNodes)
  }).run(BENCH_OPTIONS)

  await bench('re-render 200 identical nodes', {
    beforeEach: () => {
      el = new BenchRenderElement()
      vdomNodes = new Array(200).fill(0).map((_, i) => div({key: i}))
      el.render(vdomNodes)
      vdomNodes = new Array(200).fill(0).map((_, i) => div({key: i}))
    },
    afterEach: () => {
      el.dispose()
      vdomNodes.length = 0
    },
  }, () => {
    el.render(vdomNodes)
  }).run(BENCH_OPTIONS)

  await bench('re-render 200 changed tag nodes', {
    beforeEach: () => {
      el = new BenchRenderElement()
      vdomNodes = new Array(200).fill(0).map((_, i) => div({key: i}))
      el.render(vdomNodes)
      vdomNodes = new Array(200).fill(0).map((_, i) => span({key: i}))
    },
    afterEach: () => {
      el.dispose()
      vdomNodes.length = 0
    },
  }, () => {
    el.render(vdomNodes)
  }).run(BENCH_OPTIONS)

  await bench('render 200 mixed text and div nodes', {
    beforeEach: () => {
      el = new BenchRenderElement()
      vdomNodes = new Array(100).fill(0).map((_, i) => text(`label-${i}`))
      vdomNodes.push(...new Array(100).fill(0).map((_, i) => div({key: i, class: `n${i}`})))
    },
    afterEach: () => {
      el.dispose()
      vdomNodes.length = 0
    },
  }, () => {
    el.render(vdomNodes)
  }).run(BENCH_OPTIONS)
})
