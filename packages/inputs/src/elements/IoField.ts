import { Register, ReactiveProperty, IoElement, IoElementProps, span, Property, WithBinding, ListenerDefinitions, ListenerDefinition } from '@io-gui/core'
import { ioIcon } from '@io-gui/icons'

export type IoFieldProps = IoElementProps & {
  value?: WithBinding<any>
  icon?: WithBinding<string>
  label?: WithBinding<string>
  selected?: WithBinding<boolean>
  disabled?: WithBinding<boolean>
  appearance?: 'neutral' | 'inset' | 'outset'
  pattern?: string
}

@Register
export class IoField extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        cursor: pointer;
        height: var(--io_fieldHeight);
        min-height: var(--io_fieldHeight);
        line-height: var(--io_lineHeight);
        border: var(--io_border);
        border-color: transparent;
        border-radius: var(--io_borderRadius);
        padding: var(--io_spacing) var(--io_spacing2);
        color: var(--io_color);
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: var(--io_fontSize);
        text-size-adjust: 100%;
        overflow: hidden;
        @apply --unselectable;
      }
      :host:focus {
        text-overflow: inherit;
        @apply --io_focus;
      }
      :host[hidden] {
        display: none;
      }
      :host[disabled] {
        opacity: 0.5;
      }
      :host[pressed] {
        border-color: var(--io_borderColorInset) !important;
        box-shadow: var(--io_shadowInset) !important;
      }
      :host span {
        height: var(--io_lineHeight);
        vertical-align: top;
      }
      :host[appearance=neutral] {
        color: var(--io_color);
        background-color: transparent;
      }
      :host[appearance=inset] {
        color: var(--io_colorInput);
        background-color: var(--io_bgColorInput);
        border-color: var(--io_borderColorInset);
        padding-top: calc(var(--io_spacing) + 0.05em);
        padding-bottom: calc(var(--io_spacing) - 0.05em);
        box-shadow: var(--io_shadowInset);
      }
      :host[appearance=outset] {
        border-color: var(--io_borderColorOutset);
        background-image: var(--io_gradientOutset);
        box-shadow: var(--io_shadowOutset);
      }
      :host.red,
      :host[invalid] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorRed);
        border-color: var(--io_borderColorRed);
      }
      :host.green {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorGreen);
        border-color: var(--io_borderColorGreen);
      }
      :host.blue,
      :host[selected] {
        color: var(--io_colorWhite);
        background-color: var(--io_bgColorBlue);
        border-color: var(--io_borderColorBlue);
      }
    `
  }

  @ReactiveProperty({value: ''})
  declare value: any

  @ReactiveProperty({type: String, value: ''})
  declare icon: string

  @ReactiveProperty({type: String, value: '', reflect: true})
  declare label: string

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare selected: boolean

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare invalid: boolean

  // TODO: remove
  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare disabled: boolean

  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare pressed: boolean

  @ReactiveProperty({value: 'neutral', reflect: true})
  declare appearance: 'neutral' | 'inset' | 'outset'

  @ReactiveProperty({value: '', type: String, reflect: true})
  declare pattern: string

  @Property(false)
  declare spellcheck: boolean

  @Property(0)
  declare tabIndex: number

  static get Listeners(): ListenerDefinitions { // TODO: fix listener types
    return {
      'focus': 'onFocus',
      'pointerdown': 'onPointerdown',
      'touchstart': ['onTouchstart', {passive: false}] as ListenerDefinition,
      'click': 'onClick',
    }
  }

  constructor(args: IoFieldProps = {}) { super(args) }

  onFocus(event: FocusEvent) {
    this.addEventListener('blur', this.onBlur)
    this.addEventListener('keydown', this.onKeydown)
    this.addEventListener('keyup', this.onKeyup)
  }
  onBlur(event: FocusEvent) {
    this.removeEventListener('blur', this.onBlur)
    this.removeEventListener('keydown', this.onKeydown)
    this.removeEventListener('keyup', this.onKeyup)
  }
  onPointerdown(event: PointerEvent) {
    event.stopPropagation()
    this.setPointerCapture(event.pointerId)
    this.addEventListener('pointermove', this.onPointermove)
    this.addEventListener('pointerleave', this.onPointerleave)
    this.addEventListener('pointerup', this.onPointerup)
    this.addEventListener('pointercancel', this.onPointercancel)
    this.pressed = true
  }
  onPointermove(event: PointerEvent) {
    event.stopPropagation()
  }
  onPointercancel(event: PointerEvent) {
    event.stopPropagation()
    this.releasePointerCapture(event.pointerId)
    this.removeEventListener('pointermove', this.onPointermove)
    this.removeEventListener('pointerleave', this.onPointerleave)
    this.removeEventListener('pointerup', this.onPointerup)
    this.removeEventListener('pointercancel', this.onPointercancel)
    this.pressed = false
  }
  onPointerleave(event: PointerEvent) {
    event.stopPropagation()
    this.removeEventListener('pointermove', this.onPointermove)
    this.removeEventListener('pointerleave', this.onPointerleave)
    this.removeEventListener('pointerup', this.onPointerup)
    this.removeEventListener('pointercancel', this.onPointercancel)
    this.pressed = false
  }
  onPointerup(event: PointerEvent) {
    event.stopPropagation()
    this.releasePointerCapture(event.pointerId)
    this.removeEventListener('pointermove', this.onPointermove)
    this.removeEventListener('pointerleave', this.onPointerleave)
    this.removeEventListener('pointerup', this.onPointerup)
    this.removeEventListener('pointercancel', this.onPointercancel)
    this.pressed = false
  }
  onTouchstart(event: TouchEvent) {
    event.stopPropagation()
    this.addEventListener('touchmove', this.onTouchmove, {passive: false})
    this.addEventListener('touchend', this.onTouchend)
    this.focus()
  }
  onTouchmove(event: TouchEvent) {
    event.stopPropagation()
  }
  onTouchend(event: TouchEvent) {
    event.stopPropagation()
    this.removeEventListener('touchmove', this.onTouchmove)
    this.removeEventListener('touchend', this.onTouchend)
  }
  inputValue(value: any) {
    if (this.value !== value || typeof this.value === 'object') {
      const oldValue = this.value
      this.setProperty('value', value)
      this.dispatch('value-input', {value: value, oldValue: oldValue}, false)
    }
  }
  onClick(event?: MouseEvent) {
  }
  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        this.onClick()
        break
      default:
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
          event.preventDefault()
          this.dispatch('io-focus-to', {source: this, command: event.key}, true)
        }
    }
  }
  onKeyup(event: KeyboardEvent) {}

  getCaretPosition() {
    let position = 0
    const selection = window.getSelection()
    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0)
      const selected = range.toString().length
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(this as unknown as Node)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      position = preCaretRange.toString().length - selected
    }
    return position
  }
  setCaretPosition(position: number = 0){
    const selection = window.getSelection()
    // this.normalize(); // TODO: use normalize() instead?
    this._flattenTextNode(this)
    const textNode = this._textNode
    if (selection) {
      const range = document.createRange()
      range.setStart(textNode, Math.max(0, Math.min(position, textNode.length)))
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
  selectAll() {
    const selection = window.getSelection()
    this._flattenTextNode(this)
    const textNode = this._textNode
    if (selection && textNode) {
      const range = document.createRange()
      range.selectNodeContents(textNode)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
  labelChanged() {
    if (this.label) {
      this.setAttribute('aria-label', this.label)
    } else {
      this.removeAttribute('aria-label')
    }
  }
  selectedChanged() {
    if (this.selected) {
      this.setAttribute('aria-selected', 'true')
    } else {
      this.removeAttribute('aria-selected')
    }
  }
  invalidChanged() {
    if (this.invalid) {
      this.setAttribute('aria-invalid', 'true')
    } else {
      this.removeAttribute('aria-invalid')
    }
  }
  disabledChanged() {
    this.inert = this.disabled
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true')
    } else {
      this.removeAttribute('aria-disabled')
    }
  }
  changed() {
    this.render([
      this.icon ? ioIcon({value: this.icon}) : null,
      this.value !== undefined ? span(String(this.value)) : null,
    ])
  }

}

export const ioField = function(arg0: IoFieldProps) {
  return IoField.vConstructor(arg0)
}