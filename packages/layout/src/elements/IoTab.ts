import { Register, Property, span } from '@io-gui/core'
import { IoField, IoFieldProps } from '@io-gui/inputs'
import { ioIcon } from '@io-gui/icons'
import { Tab } from '../models/Tab.js'

export type IoTabData = IoFieldProps & {
  model: Tab
}

export type TabActions = 'select' | 'delete' | 'move-left' | 'move-right' | 'move-start' | 'move-end'
export type TabDragPhase = 'start' | 'move' | 'end' | 'cancel'

function keyToAction(key: string): TabActions | undefined {
  switch (key) {
    case 'Backspace':
      return 'delete'
    case 'ArrowLeft':
      return 'move-left'
    case 'ArrowRight':
      return 'move-right'
    case 'Home':
      return 'move-start'
    case 'End':
      return 'move-end'
  }
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

  private _pointerDown: [number, number] = [0, 0]
  private _dragging: boolean = false

  constructor(args: IoTabData) { super(args) }

  onResized() {
    const span = this.querySelector('span')!
    this.overflow = span.scrollWidth > span.clientWidth
  }

  override onPointerdown(event: PointerEvent) {
    super.onPointerdown(event)
    this._pointerDown = [event.clientX, event.clientY]
    this._dragging = false
  }
  
  override onPointermove(event: PointerEvent): void {
    if (this._dragging) {
      this.dispatchDrag('move', event.clientX, event.clientY)
    } else {
      const [x, y] = this._pointerDown
      const distance = Math.sqrt((x - event.clientX) ** 2 + (y - event.clientY) ** 2)
      if (distance > 10) {
        this._dragging = true
        this.dispatchDrag('start', event.clientX, event.clientY)
      }
    }
    super.onPointermove(event)
  }
  override onPointercancel(event: PointerEvent) {
    super.onPointercancel(event)
    this.dispatchDrag('cancel', event.clientX, event.clientY)
  }
  override onPointerleave(event: PointerEvent) {
    super.onPointerleave(event)
    this.dispatchDrag('cancel', event.clientX, event.clientY)
  }
  override onPointerup(event: PointerEvent) {
    super.onPointerup(event)
    this.dispatchDrag('end', event.clientX, event.clientY)
  }

  override onClick() {
    if (this._dragging) return
    this.dispatchAction('select')
  }

  dispatchAction(action: TabActions) {
    this.dispatch('io-tab-action', {model: this.model, action}, true)
  }

  dispatchDrag(phase: TabDragPhase, x: number, y: number) {
    this.dispatch('io-tab-drag', {model: this.model, phase, x, y}, true)
  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation()
  }

  onClose(event: PointerEvent) {
    event.stopPropagation()
    this.dispatchAction('delete')
  }

  override onKeydown(event: KeyboardEvent) {
    const action = keyToAction(event.key)
    if (event.shiftKey && action !== undefined) {
      event.preventDefault()
      this.dispatchAction(action)
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
