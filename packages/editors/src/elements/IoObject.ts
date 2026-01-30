import { Register, IoElement, ReactiveProperty, IoElementProps, WithBinding, VDOMElement, Property, Storage as $ } from '@io-gui/core'
import { ioBoolean } from '@io-gui/inputs'
import { ioPropertyEditor } from './IoPropertyEditor.js'
import { PropertyConfig } from '../utils/EditorConfig.js'
import { PropertyGroups } from '../utils/EditorGroups.js'

export type IoObjectProps = IoElementProps & {
  value?: Record<string, any> | any[]
  properties?: string[]
  labeled?: boolean
  label?: string
  labelWidth?: string
  expanded?: WithBinding<boolean>
  persistentExpand?: boolean
  config?: PropertyConfig[]
  groups?: PropertyGroups
  widget?: VDOMElement | null
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
      max-width: 100%;
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
      /* margin: var(--io_spacing); */
      margin: calc(var(--io_spacing) * 2);
      margin-top: calc(var(--io_spacing) * 2) !important;
      margin-left: calc(var(--io_spacing) * 4);
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
    }
    `
  }

  @ReactiveProperty()
  declare value: Record<string, unknown> | Array<unknown>

  @ReactiveProperty({type: Array, init: null})
  declare properties: string[] | null

  @ReactiveProperty({type: String, value: ''})
  declare label: string

  @ReactiveProperty(true)
  declare labeled: boolean

  @ReactiveProperty('80px')
  declare labelWidth: string

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean

  @ReactiveProperty({value: false})
  declare persistentExpand: boolean

  @ReactiveProperty({type: Array, init: null})
  declare config: PropertyConfig[]

  @ReactiveProperty({type: Object, init: null})
  declare groups: PropertyGroups

  @ReactiveProperty({type: Object})
  declare widget: VDOMElement | undefined | null

  @Property('region')
  declare role: string

  valueChanged() {
    if (!this.value) return

    debug: {
      if (typeof this.value !== 'object' && !Array.isArray(this.value)) {
        console.warn('IoObject: value is not an object or array', this, this.value)
      }
    }

    let uuid = genIdentifier(this.value)
    let storage: 'local' | 'none' = 'local'
    if (!uuid) {
      uuid = getTempIdentifier(this.value)
      storage = 'none'
    }

    // TODO: Test
    const expandedBinding = $({value: this.expanded ?? false, storage: storage, key: uuid + '-' + this.label})
    const bindingTargets = expandedBinding.targets
    const targetIsThis = bindingTargets.has(this)

    if (bindingTargets.size < 1) {
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

    const propCount = Object.keys(this.value).length

    const vChildren: VDOMElement[] = []
    vChildren.push(ioBoolean({
      appearance: 'neutral',
      true: label,
      false: label,
      value: this.bind('expanded'),
      disabled: propCount === 0 ? true : false
    }))
    if (this.expanded && propCount > 0) {
      vChildren.push(ioPropertyEditor({
        value: this.value,
        properties: this.properties,
        config: this.config,
        groups: this.groups,
        widget: this.widget,
        labeled: this.labeled,
        labelWidth: this.labelWidth,
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