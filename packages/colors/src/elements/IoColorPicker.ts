import { Register, Property, ReactiveElement, ReactiveElementProps, Field, WithBinding, nudge, ListenerDefinitions } from '@io-gui/core'
import { IoColorPanelSingleton as Panel } from './IoColorPanelSingleton.js'
import { ioColorSwatch } from './IoColorSwatch.js'

// TODO: focus picker on expand.
// TODO: collapse picker on blur.
// TODO: fix focus keybord navigation.

export type IoColorPickerProps = ReactiveElementProps &{
  value: WithBinding<{ r: number; g: number; b: number; a?: number }>
}

@Register
export class IoColorPicker extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        position: relative;
        height: var(--io_fieldHeight);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        border-radius: var(--io_borderRadius);
        overflow: hidden;
      }
      :host:focus {
        @apply --io_focus;
      }
      :host > io-color-swatch {
        width: 100%;
        height: 100%;
      }
    `
  }

  @Property({value: {r: 1, g: 1, b: 1, a: 1}})
  declare value: {r: number; g: number; b: number; a?: number}

  static override get Listeners(): ListenerDefinitions {
    return {
      'click': 'onClick',
      'keydown': 'onKeydown',
    }
  }

  @Field(0)
  declare tabIndex: number

  get expanded() {
    return Panel.expanded && Panel.src === this
  }

  override ready() {
    this.valueChanged()
  }

  onClick() {
    if (!this.expanded) this.expand()
  }

  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!this.expanded) this.expand()
        break
      default:
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) {
          event.preventDefault()
          this.dispatch('io-focus-to', {source: this, command: event.key}, true)
        }
    }
  }
  onPanelValueInput() {
    this.dispatch('value-input', {property: 'value', value: this.value}, true)
  }
  expand() {
    Panel.setProperties({
      src: this,
      value: this.value,
      expanded: true
    })
    nudge(Panel, this, 'right');
    (Panel.firstChild?.firstChild as HTMLElement)?.focus()
  }
  collapse() {
    if (Panel.src === this) {
      Panel.src = null
      Panel.expanded = false
    }
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    if (Panel.src === this) {
      Panel.src = null
      Panel.expanded = false
    }
  }
  valueChanged() {
    this.render([
      ioColorSwatch({value: this.value})
    ])
  }
}
export const ioColorPicker = function(arg0: IoColorPickerProps) {
  return IoColorPicker.vConstructor(arg0)
}
