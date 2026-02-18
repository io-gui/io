import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, span, VDOMElement } from '@io-gui/core'
import { ioBreadcrumbs } from './IoBreadcrumbs.js'
import { ioPropertyEditor } from './IoPropertyEditor.js'
import { PropertyConfig } from '../utils/EditorConfig.js'
import { getAllPropertyNames, PropertyGroups } from '../utils/EditorGroups.js'
import { ioPropertyLink } from './IoPropertyLink.js'

export type IoInspectorProps = IoElementProps & {
  value?: Record<string, any> | any[]
  selected?: WithBinding<Record<string, any> | any[]>
  search?: WithBinding<string>
  config?: PropertyConfig[]
  groups?: PropertyGroups
  widget?: VDOMElement
}

function isNestedObject(value: object, selected: object): boolean {
  if (value === selected) return true
  if (value instanceof Array) {
    return value.some(v => isNestedObject(v, selected))
  }
  if (value instanceof Object) {
    return Object.keys(value).some(k => isNestedObject(value[k as keyof typeof value], selected))
  }
  return false
}

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple
 * `io-collapsible` elements. It can be configured to use custom property editors and display only specified properties.
 * Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
@Register
export class IoInspector extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      flex: 0 1 calc(var(--io_lineHeight) * 17.5);
      padding: var(--io_spacing);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-breadcrumbs {
      margin: 0 var(--io_spacing);
    }
    :host > span {
      padding: var(--io_spacing) var(--io_spacing3);
      color: var(--io_colorStrong);
    }
    :host io-property-editor > .row > span {
      min-width: 6em;
      text-align: right;
    }
    `
  }
  @ReactiveProperty({type: Object, init: null})
  declare value: object | Array<any>

  @ReactiveProperty({type: Object, init: null})
  declare selected: object | Array<any>

  @ReactiveProperty({type: String})
  declare search: string

  @ReactiveProperty({type: Array, init: null})
  declare config: PropertyConfig[]

  @ReactiveProperty({type: Object, init: null})
  declare groups: PropertyGroups

  @ReactiveProperty({type: Object})
  declare widget: VDOMElement

  static get Listeners() {
    return {
      'io-button-clicked': 'onLinkClicked',
    }
  }
  onLinkClicked(event: CustomEvent) {
    event.stopPropagation()
    const value = event.detail.value
    const item = event.composedPath()[0] as any
    if (value && typeof value === 'object') {
      if (item.localName === 'io-property-link' || item.className === 'back-button') {
        this.setProperty('selected', value)
      }
    }
  }
  valueChanged() {
    this.selected = this.value
  }
  valueMutated() {
    // TODO: Improve this check to update selected to new object if it replaced the previously selected.
    if (!isNestedObject(this.value, this.selected)) {
      this.selected = this.value
    }
    this.changed()
  }
  selectedMutated() {
    this.changed()
  }
  selectedChanged() {
    this.search = ''
  }
  changed() {
    this.debounce(this.changedDebounced)
  }
  changedDebounced() {
    const vChildren = [
      ioBreadcrumbs({value: this.value, selected: this.bind('selected'), search: this.bind('search')}),
    ]

    const config = [...this.config]

    config.push([Object, ioPropertyLink({showName: true})])

    const properties = []
    if (this.search) {
      for (const key of getAllPropertyNames(this.selected)) {
        if (key.toLowerCase().includes(this.search.toLowerCase())) {
          properties.push(key)
        }
      }
    }

    if (this.search && properties.length === 0) {
      vChildren.push(
        span(`No results found for "${this.search}"`),
      )
    } else {
      vChildren.push(
        ioPropertyEditor({
          value: this.selected,
          config: config,
          groups: this.groups,
          widget: this.widget,
          properties: properties,
        }),
      )
    }

    this.render(vChildren)
  }
  dispose() {
    super.dispose()
    window.removeEventListener('io-object-mutation', this.onPropertyMutated as unknown as EventListener)
  }
}
export const ioInspector = function(arg0?: IoInspectorProps) {
  return IoInspector.vConstructor(arg0)
}


