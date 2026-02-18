import { IoElement, ReactiveProperty, Register, IoElementProps, ReactiveNode, span, div, HTML_ELEMENTS, VDOMElement } from '@io-gui/core'
import { IoField } from '@io-gui/inputs'
import { PropertyConfig, PropertyConfigRecord, getEditorConfig } from '../utils/EditorConfig.js'
import { PropertyGroups, getEditorGroups, PropertyGroupsRecord, getAllPropertyNames } from '../utils/EditorGroups.js'
import { getEditorWidget } from '../utils/EditorWidgets.js'
import { ioObject } from './IoObject.js'

export type IoPropertyEditorProps = IoElementProps & {
  value?: Record<string, any> | any[]
  properties?: string[] | null
  label?: string
  labeled?: boolean
  labelWidth?: string
  config?: PropertyConfig[]
  groups?: PropertyGroups
  widget?: VDOMElement | null
}

/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
@Register
export class IoPropertyEditor extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      color: var(--io_colorInput);
      background-color: var(--io_bgColor);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing));
      font-size: var(--io_fontSize);
      overflow: auto;
    }
    :host > .row {
      display: flex;
      flex-direction: row;
      flex: 1 1 auto;
      margin: var(--io_spacing);
      padding: var(--io_spacing) 0;
      border-radius: var(--io_borderRadius);
      margin-bottom: 0;
      background-color: var(--io_bgColorLight);
    }
    :host io-property-editor {
      margin-top: calc(var(--io_spacing) * -1) !important;
    }
    :host io-property-editor > .row {
      /* margin: 0 !important; */
      padding: 0 !important;
    }
    :host > .row:last-of-type {
      margin-bottom: var(--io_spacing);
    }
    :host > .row > span {
      flex: 0 0 auto;
      padding: var(--io_borderWidth); /* TODO: verify correctness */
      margin: var(--io_spacing);
      margin-left: var(--io_spacing2);
      line-height: var(--io_lineHeight);
      height: var(--io_lineHeight);
      text-wrap: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host > .row > span:after {
      display: inline-block;
      margin-left: var(--io_spacing);
      opacity: 0.5;
      content: ':';
    }

    :host > .row > :not(span) {
      flex-grow: 1;
    }
    `
  }

  // @ReactiveProperty('debounced')
  // declare reactivity: ReactivityType

  @ReactiveProperty()
  declare value: object | Array<unknown>

  @ReactiveProperty({type: Array})
  declare properties: string[] | undefined

  @ReactiveProperty({type: String, value: ''})
  declare label: string

  @ReactiveProperty(true)
  declare labeled: boolean

  @ReactiveProperty('80px')
  declare labelWidth: string

  @ReactiveProperty({type: Array, init: null})
  declare config: PropertyConfig[]

  @ReactiveProperty({type: Object, init: null})
  declare groups: PropertyGroups

  @ReactiveProperty({type: Object})
  declare widget: VDOMElement | undefined | null

  private _config: PropertyConfigRecord | null = null
  private _groups: PropertyGroupsRecord | null = null
  private _widget: VDOMElement | null = null

  private _propertyEditors: Record<string, IoField> = {}

  _onValueInput(event: CustomEvent) {
    event.stopImmediatePropagation()
    const id = (event.target as HTMLElement).id
    if (id !== undefined) {
      (this.value as Record<string, any>)[id] = event.detail.value
      if (!(this.value as unknown as ReactiveNode)._isNode) {
        this.dispatchMutation(this.value)
      }
    } else {
      debug: console.warn('IoPropertyEditor: "value-input" recieved from an input without a property id')
    }
  }

  configChanged() {
    this.debounce(this.configureDebounced)
  }
  groupsChanged() {
    this.debounce(this.configureDebounced)
  }
  widgetChanged() {
    this.debounce(this.configureDebounced)
  }
  valueChanged() {
    debug: {
      if ((this.value !== null && typeof this.value !== 'object') && !Array.isArray(this.value)) {
        console.warn('IoPropertyEditor: value is not an object or array', this, this.value)
      }
    }
    this.debounce(this.configureDebounced)
  }
  configureDebounced() {
    this._propertyEditors = {}
    if (!this.value || typeof this.value !== 'object') {
      this._config = null
      this._groups = null
      this._widget = null
      this.render([])
      return
    } else {
      this._config = getEditorConfig(this.value, this.config)
      this._groups = getEditorGroups(this.value, this.groups)
      this._widget = this.widget !== undefined ? this.widget : getEditorWidget(this.value)

      const config = this._config
      const groups = this._groups
      const widget = this._widget

      if (!config || !groups) return

      const properties = []
      const vChildren = []

      if (widget) {
        const widgetWithValue = {
          tag: widget.tag,
          // widget: null prevents recursive widget lookup in nested io-property-editors
          props: Object.assign({value: this.value, widget: null}, widget.props),
          children: widget.children
        }
        vChildren.push(widgetWithValue)
      }
      if (this.properties !== undefined) {
        properties.push(...this.properties)
      } else {
        properties.push(...groups.Main)
      }

      const allProps = getAllPropertyNames(this.value)

      for (let i = 0; i < properties.length; i++) {
        if (allProps.includes(properties[i])) {
          const id = properties[i] as keyof typeof this.value
          const value = this.value[id]
          const tag = config[id]!.tag
          const props = config[id]!.props as (IoElementProps | undefined) || {}

          const finalProps: any = {id: id, value: value, '@value-input': this._onValueInput}

          Object.assign(finalProps, props)

          let children: string | undefined = undefined
          if (HTML_ELEMENTS.includes(tag) && typeof value === 'string') {
            children = value
          }

          if (tag === 'io-object' || tag === 'io-property-editor') {
            finalProps.config = finalProps.config || this.config
            finalProps.groups = finalProps.groups || this.groups
          }
          if (tag === 'io-object') {
            finalProps.persistentExpand = true
          }
          // NOTE: Functions dont have labels. They are displayed as labeled buttons.
          const isFunction = typeof value === 'function'
          if (isFunction) {
            finalProps.action = (value as any).bind(this.value)
            finalProps.label = finalProps.label || id
          }

          const isIoObject = tag === 'io-object'
          if (isIoObject) {
            finalProps.label = finalProps.label ||id + ': ' + (value as object)?.constructor?.name || String(value)
          }

          // TODO: Document and reconsider this
          const label = finalProps.label || id
          const tooltip = label
          const hideLabel = finalProps.label === '_hidden_'

          if (finalProps.class) {
            finalProps.class += ' io-property-editor-field'
          } else {
            finalProps.class = 'io-property-editor-field'
          }

          vChildren.push(div({class: 'row'}, [
            (this.labeled && !hideLabel && !isFunction && !isIoObject) ? span({style: {width: this.labelWidth}, title: tooltip}, label) : null,
            {tag: tag, props: finalProps, children: children},
          ]))
        } else {
          debug: console.warn(`IoPropertyEditor: property "${properties[i]}" not found in value`)
        }
      }

      if (this.properties === undefined) {
        for (const group in groups) {
          if (group !== 'Main' && group !== 'Hidden' && groups[group].length) {
            vChildren.push(
              ioObject({
                label: group,
                labelWidth: this.labelWidth,
                persistentExpand: true,
                value: this.value,
                widget: null,
                properties: groups[group],
                config: this.config,
              }),
            )
          }
        }
      }

      this.render(vChildren)

      for ( const child of Object.values(this.$) ) {
        if (child.classList.contains('io-property-editor-field')) {
          this._propertyEditors[child.id] = child as IoField
        }
      }
    }
  }
  valueMutated() {
    this.throttle(this.changedThrottled)
  }
  changed() {
    this.throttle(this.changedThrottled)
  }
  changedThrottled() {
    if (!this.value || typeof this.value !== 'object') return
    for (const id in this._propertyEditors) {
      if (!(id in this.value)) continue
      const value = this.value[id as keyof typeof this.value]
      const editor = this._propertyEditors[id]
      editor.value = value
    }
  }
  dispose() {
    super.dispose()
    this._propertyEditors = {}
  }
}
export const ioPropertyEditor = function(arg0?: IoPropertyEditorProps) {
  return IoPropertyEditor.vConstructor(arg0)
}