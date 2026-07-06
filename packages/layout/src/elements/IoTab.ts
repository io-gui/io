import { Register, Property, span } from '@io-gui/core'
import { IoField, IoFieldProps } from '@io-gui/inputs'
import { ioIcon } from '@io-gui/icons'
import { Tab } from '../models/Tab.js'

export type IoTabData = IoFieldProps & {
  model: Tab
}

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoTab extends IoField {
  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        position: relative;
        height: inherit;
        min-height: inherit;
        /* TODO: use vars for this */
        min-width: calc(var(--io_fieldHeight) * 1.25);
        margin: 0;
        margin-right: var(--io_spacing);
        background-color: var(--io_bgColorStrong) !important;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-color: var(--io_borderColorLight);
        padding: var(--io_spacing2);
        border-bottom-color: var(--io_borderColorStrong);
      }
      :host[pressed] {
        border-color: unset !important;
        box-shadow: unset !important;
      }
      :host[selected] {
        color: var(--io_color);
        background-color: var(--io_bgColor) !important;
        border-color: var(--io_borderColorStrong);
        border-bottom-color: var(--io_bgColor);
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
      }
      :host > span {
        padding: 0 var(--io_spacing);
        overflow: hidden; 
        text-overflow: ellipsis !important;
      }
      :host > * {
        pointer-events: none;
        display: inline-block;
        white-space: nowrap;
      }
      :host > .io-tab-icon {
        margin: 0 var(--io_spacing) 0 var(--io_spacing) !important;
      }
      :host > .io-tab-close {
        pointer-events: auto;
        opacity: 0;
        margin: 0 var(--io_spacing) 0 0 !important;
        transform: scale(0.6);
      }
      :host:hover > .io-tab-close {
        opacity: 1;
        transform: scale(0.5);
      }
      :host > .io-tab-close:hover {
        transform: scale(0.6);
        fill: var(--io_colorStrong);
      }
    `
  }

  @Property({type: Tab})
  declare model: Tab

  @Property({type: Boolean, reflect: true})
  declare overflow: boolean

  constructor(args: IoTabData) { super(args) }

  onResized() {
    const span = this.querySelector('span')!
    this.overflow = span.scrollWidth > span.clientWidth
  }

  override onClick() {
    this.dispatch('io-tab-action', {tab: this.model, action: 'Select'}, true)
  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation()
  }

  onClose(event: PointerEvent) {
    event.stopPropagation()
    this.dispatch('io-tab-action', {tab: this.model, action: 'Backspace'}, true)
  }

  override onKeydown(event: KeyboardEvent) {
    if (event.shiftKey && ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      this.dispatch('io-tab-action', {tab: this.model, action: event.key}, true)
    } else {
      super.onKeydown(event)
    }
  }

  modelMutated() {
    this.mutated()
  }

  override mutated() {
    this.setAttribute('selected', this.model.selected)
    this.setAttribute('title', this.model.label)
    this.render([
      this.model.icon ? ioIcon({value: this.model.icon, class: 'io-tab-icon'}) : null,
      span({class: 'io-tab-label'}, this.model.label),
      ioIcon({value: 'io:close', class: 'io-tab-close',
        '@pointerdown': this.stopPropagation,
        '@click': this.onClose
      })
    ])
  }
}

export const ioTab = function(arg0: IoTabData) {
  return IoTab.vConstructor(arg0)
}
