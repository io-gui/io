import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, VDOMElement, Property } from '@io-gui/core'
import { ioBoolean } from '@io-gui/inputs'
import { ioPropertyEditor } from './IoPropertyEditor.js'
import { PropertyConfig } from '../utils/EditorConfig.js'
import { PropertyGroups } from '../utils/EditorGroups.js'
import { EditorWidgets } from '../utils/EditorWidgets.js'

export type IoObjectProps = IoElementProps & {
  value?: Record<string, any> | any[]
  properties?: string[]
  labeled?: boolean
  label?: string
  expanded?: WithBinding<boolean>
  config?: PropertyConfig[]
  groups?: PropertyGroups
  widgets?: EditorWidgets
}

/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside io-collapsible element. It can be configured to use custom property editors and display only specified properties.
 **/
@Register
export class IoObject extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
    }
    :host > io-boolean {
      padding: var(--io_spacing) var(--io_spacing2);
      align-self: stretch;
    }
    :host > io-boolean:before {
      display: inline-block;
      width: 0.75em;
      content: "▸"
    }
    :host > io-boolean[value]:before {
      content: "▾";
    }
    :host > io-property-editor {
      margin: var(--io_spacing);
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
    }
    `
  }

  @ReactiveProperty({type: Object})
  declare value: Record<string, any> | any[]

  @ReactiveProperty({type: Array, init: null})
  declare properties: string[] | null

  @ReactiveProperty(true)
  declare labeled: boolean

  @ReactiveProperty('')
  declare label: string

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean

  @ReactiveProperty({type: Array, init: null})
  declare config: PropertyConfig[]

  @ReactiveProperty({type: Object, init: null})
  declare groups: PropertyGroups

  @ReactiveProperty({type: Map, init: null})
  declare widgets: EditorWidgets

  @Property('region')
  declare role: string

  changed() {
    const label = this.label || this.value.constructor.name
    const vChildren: VDOMElement[] = []
    vChildren.push(ioBoolean({
      appearance: 'neutral',
      true: label,
      false: label,
      value: this.bind('expanded')}
    ))
    if (this.expanded) {
      vChildren.push(ioPropertyEditor({
        value: this.value,
        properties: this.properties,
        config: this.config,
        groups: this.groups,
        widgets: this.widgets,
        labeled: this.labeled,
      }))
    }
    this.render(vChildren)
    this.setAttribute('aria-expanded', String(this.expanded))
  }
}
export const ioObject = function(arg0?: IoObjectProps) {
  return IoObject.vConstructor(arg0)
}