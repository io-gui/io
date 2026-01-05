import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, VDOMElement, Property, Storage as $ } from '@io-gui/core'
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
  persistentExpand?: boolean
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

  @ReactiveProperty({value: false})
  declare persistentExpand: boolean

  @ReactiveProperty({type: Array, init: null})
  declare config: PropertyConfig[]

  @ReactiveProperty({type: Object, init: null})
  declare groups: PropertyGroups

  @ReactiveProperty({type: Map, init: null})
  declare widgets: EditorWidgets

  @Property('region')
  declare role: string

  valueChanged() {

    let uuid = genIdentifier(this.value)
    let storage: 'local' | 'none' = 'local'
    if (!uuid) {
      uuid = getTempIdentifier(this.value)
      storage = 'none'
    }

    // TODO: Test
    const expandedBinding = $({value: false, storage: storage, key: uuid + '-' + this.label});
    const bindingTargets = expandedBinding.targets
    const bindingTargetCount = bindingTargets.length
    const targetIsThis = bindingTargets.some(target => target === this)

    if (bindingTargetCount < 1) {
      if (!targetIsThis) {
        const targetP = this._reactiveProperties.get('expanded')!
        if (targetP.binding && targetP.binding !== expandedBinding) {
          targetP.binding.removeTarget(this, 'expanded')
        }
        expandedBinding.addTarget(this, 'expanded')
      }
    }
  }

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

function genIdentifier(object: any) {
  const id = object.guid || object.uuid || object.id || object.name || object.label
  if (id) {
    return 'io-object-collapse-state-' + object.constructor.name + '-' + id
  }
}

const tempIdentifiers = new WeakMap<object, string>()

function getTempIdentifier(object: any) {
  if (!tempIdentifiers.has(object)) {
    const randomuuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    tempIdentifiers.set(object, randomuuid)
  }
  return tempIdentifiers.get(object)!
}