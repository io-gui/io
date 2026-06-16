import { describe } from 'vitest'
import { benchHeavy } from '../../../core/src/testing/bench.js'
import {
  benchFreshVsCached,
  benchInitialRender,
  createInspectorValue,
  createPropertyEditorValue,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { IoPropertyEditor, IoInspector, IoObject, IoBreadcrumbs } from '@io-gui/editors'

describe('IoPropertyEditor', () => {
  const value = createPropertyEditorValue()

  benchInitialRender('20 mixed properties', (mount) => {
    const el = new IoPropertyEditor({ value: createPropertyEditorValue(), labeled: true })
    mount(el)
    el.configureDebounced()
    el.dispose()
  }, true)

  const steadyEditor = new IoPropertyEditor({ value, labeled: true })
  warmElement(steadyEditor, () => steadyEditor.configureDebounced())

  benchFreshVsCached({
    label: 'configureDebounced',
    heavy: true,
    fresh: () => steadyEditor.configureDebounced(),
  })

  benchHeavy('steady: valueMutated throttle path (no render)', () => {
    value.count = (value.count as number) + 1
    steadyEditor.valueMutated()
    steadyEditor.changedThrottled()
  })
})

describe('IoInspector', () => {
  const { value, child } = createInspectorValue()

  benchInitialRender('inspector', (mount) => {
    const { child: c } = createInspectorValue()
    const el = new IoInspector({ value: createPropertyEditorValue(), selected: c })
    mount(el)
    el.changedDebounced()
    el.dispose()
  }, true)

  const steadyInspector = new IoInspector({ value, selected: value })
  warmElement(steadyInspector, () => steadyInspector.changedDebounced())

  benchFreshVsCached({
    label: 'selectedChanged + valueMutated',
    heavy: true,
    fresh: () => {
      steadyInspector.selected = child
      steadyInspector.selectedChanged()
      value.name = value.name === 'Widget' ? 'Updated' : 'Widget'
      steadyInspector.changedDebounced()
    },
  })
})

describe('IoObject', () => {
  const value = createPropertyEditorValue()

  benchInitialRender('object group', (mount) => {
    const el = new IoObject({
      label: 'Advanced',
      value: createPropertyEditorValue(),
      properties: ['name', 'count', 'enabled', 'ratio'],
      expanded: true,
      persistentExpand: true,
    })
    mount(el)
    el.changed()
    el.dispose()
  }, true)

  const steadyObject = new IoObject({
    label: 'Advanced',
    value,
    properties: ['name', 'count', 'enabled', 'ratio'],
    expanded: true,
    persistentExpand: true,
  })
  warmElement(steadyObject, () => steadyObject.changed())

  benchFreshVsCached({
    label: 'expand toggle',
    heavy: true,
    fresh: () => {
      steadyObject.expanded = !steadyObject.expanded
      steadyObject.changed()
    },
  })
})

describe('IoBreadcrumbs', () => {
  class NamedNode {
    name: string
    constructor(public id: string) {
      this.name = id
    }
  }

  const nodes = [new NamedNode('root'), new NamedNode('child'), new NamedNode('leaf')]

  benchInitialRender('breadcrumbs', (mount) => {
    const el = new IoBreadcrumbs({ value: new NamedNode('root'), selected: new NamedNode('leaf') })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyCrumbs = new IoBreadcrumbs({ value: nodes[0], selected: nodes[2] })
  warmElement(steadyCrumbs, () => steadyCrumbs.changed())

  benchFreshVsCached({
    label: 'search keystroke',
    fresh: () => {
      steadyCrumbs.search = steadyCrumbs.search ? '' : 'leaf'
      steadyCrumbs.changed()
    },
  })
})
