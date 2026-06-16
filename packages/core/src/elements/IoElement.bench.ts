import { describe } from 'vitest'
import { bench } from '../testing/bench.js'
import { benchFreshVsCached, warmRender } from '../testing/bench-render.js'
import { Register } from '../decorators/Register.js'
import { IoElement } from './IoElement.js'
import { div, span } from './IoNative.js'
import { text, VDOMElement } from '../vdom/VDOM.js'

const NODE_COUNT = 200

@Register
class BenchRenderElement extends IoElement {
  freshNodes(changed = 0) {
    const nodes: VDOMElement[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(div({key: i, class: i < changed ? 'changed' : 'same'}))
    }
    return nodes
  }
  renderFresh(changed = 0) {
    this.render(this.freshNodes(changed))
  }
}

@Register
class BenchCachedRenderElement extends IoElement {
  cachedNodes: VDOMElement[] = []
  cachedTopLevel: VDOMElement[] = []
  cachedWrapper: VDOMElement | undefined
  sharedChildren: VDOMElement[] = []

  initCachedNodes() {
    this.cachedNodes = []
    for (let i = 0; i < NODE_COUNT; i++) {
      this.cachedNodes.push(div({class: 'same'}))
    }
    this.cachedTopLevel = this.cachedNodes
  }

  initCachedNested() {
    this.sharedChildren = []
    for (let i = 0; i < NODE_COUNT; i++) {
      this.sharedChildren.push(span({class: 'child'}))
    }
    this.cachedWrapper = div({class: 'wrapper'}, this.sharedChildren)
    this.cachedTopLevel = [this.cachedWrapper]
  }

  initWidgetPattern() {
    this.sharedChildren = []
    for (let i = 0; i < NODE_COUNT; i++) {
      this.sharedChildren.push(span({class: 'widget-child'}))
    }
  }

  renderCachedNodes() {
    this.render(this.cachedTopLevel)
  }

  renderWidgetPattern(iteration: number) {
    const wrapper: VDOMElement = {
      tag: 'div',
      props: {class: 'widget', value: iteration},
      children: this.sharedChildren,
    }
    this.render([wrapper])
  }
}

@Register
class BenchDisposeRenderElement extends IoElement {
  nodes: VDOMElement[] = []

  buildNodes(count: number) {
    this.nodes = []
    for (let i = 0; i < count; i++) {
      this.nodes.push(div({class: `n${i}`}, [
        span({class: 'label'}, `item-${i}`),
        span({'@click': () => {}}),
      ]))
    }
  }

  renderCount(count: number) {
    this.render(this.nodes.slice(0, count))
  }
}

describe('IoElement', () => {
  bench('render 200 div nodes', () => {
    const el = new BenchRenderElement()
    el.renderFresh()
    el.dispose()
  })

  bench('re-render 200 fresh VDOM (no cache)', () => {
    const el = new BenchRenderElement()
    el.renderFresh()
    el.renderFresh(0)
    el.dispose()
  })

  bench('re-render 200 cached VDOM references', () => {
    const el = new BenchCachedRenderElement()
    el.initCachedNodes()
    el.renderCachedNodes()
    el.renderCachedNodes()
    el.dispose()
  })

  bench('bail-out top-level cached array', () => {
    const el = new BenchCachedRenderElement()
    el.initCachedNodes()
    el.renderCachedNodes()
    el.render(el.cachedTopLevel)
    el.dispose()
  })

  bench('re-render nested cached children array', () => {
    const el = new BenchCachedRenderElement()
    el.initCachedNested()
    el.renderCachedNodes()
    el.renderCachedNodes()
    el.dispose()
  })

  bench('widget pattern shared children array', () => {
    const el = new BenchCachedRenderElement()
    el.initWidgetPattern()
    el.renderWidgetPattern(0)
    el.renderWidgetPattern(1)
    el.dispose()
  })

  bench('re-render 10 changed', () => {
    const el = new BenchRenderElement()
    el.renderFresh()
    el.renderFresh(10)
    el.dispose()
  })

  bench('remove 100 of 200 nodes', () => {
    const el = new BenchDisposeRenderElement()
    el.buildNodes(NODE_COUNT)
    el.renderCount(NODE_COUNT)
    el.renderCount(NODE_COUNT / 2)
    el.dispose()
  })

  bench('render 200 mixed text and div nodes', () => {
    const nodes: VDOMElement[] = []
    for (let i = 0; i < 100; i++) {
      nodes.push(text(`label-${i}`))
      nodes.push(div({key: i, class: `n${i}`}))
    }
    const el = new BenchRenderElement()
    el.render(nodes)
    el.dispose()
  })
})

describe('IoElement steady-state re-render', () => {
  const freshEl = new BenchRenderElement()
  warmRender(() => freshEl.renderFresh())

  const cachedEl = new BenchCachedRenderElement()
  cachedEl.initCachedNodes()
  warmRender(() => cachedEl.renderCachedNodes())

  const nestedEl = new BenchCachedRenderElement()
  nestedEl.initCachedNested()
  warmRender(() => nestedEl.renderCachedNodes())

  const widgetEl = new BenchCachedRenderElement()
  widgetEl.initWidgetPattern()
  warmRender(() => widgetEl.renderWidgetPattern(0))

  benchFreshVsCached({
    label: '200 nodes',
    fresh: () => freshEl.renderFresh(0),
    cached: () => cachedEl.renderCachedNodes(),
  })

  bench('steady: bail-out top-level cached array', () => {
    cachedEl.render(cachedEl.cachedTopLevel)
  })

  bench('steady: re-render nested cached children', () => {
    nestedEl.renderCachedNodes()
  })

  bench('steady: widget pattern new wrapper', () => {
    widgetEl.renderWidgetPattern(1)
  })

  bench('steady: hot mutation (10 changed keys)', () => {
    freshEl.renderFresh(10)
  })
})
