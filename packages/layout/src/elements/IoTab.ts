import { Register, ReactiveProperty, span } from '@io-gui/core'
import { IoField, IoFieldProps, ioField, ioString } from '@io-gui/inputs'
import { IoContextEditorSingleton } from '@io-gui/editors'
import { IconsetDB, ioIcon } from '@io-gui/icons'
import { MenuOptionProps, MenuOption, ioOptionSelect } from '@io-gui/menus'
import { IoPanel } from './IoPanel.js'
import { IoLayout } from './IoLayout.js'
import { Tab } from '../nodes/Tab.js'
import { tabDragIconSingleton } from './IoTabDragIcon.js'

const icons: MenuOptionProps[] = []
for (const set of Object.keys(IconsetDB)) {
  for (const icon of Object.keys(IconsetDB[set])) {
    const id = `${set}:${icon}`
    icons.push({value: id, id: icon, icon: id})
  }
}

const iconOptions = ioOptionSelect({selectBy: 'value', label: 'Icon', option: new MenuOption({options: icons})})

export type IoTabProps = IoFieldProps & {
  tab: Tab
}

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoTab extends IoField {
  static get Style() {
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
        background-color: var(--io_bgColor) !important;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-color: var(--io_borderColorLight);
        padding-right: calc(var(--io_lineHeight) / 2);
        padding-left: calc(var(--io_lineHeight) / 2);
      }
      :host[pressed] {
        border-color: unset !important;
        box-shadow: unset !important;
      }
      :host[selected] {
        color: var(--io_colorStrong);
        background-color: var(--io_bgColorLight) !important;
        border-color: var(--io_borderColorStrong);
        border-bottom-color: var(--io_bgColorLight);
        z-index: 1;
      }
      :host[overflow]:not([selected]) > .io-close-icon {
        display: none;
      }
      :host[selected]:focus {
        color: var(--io_colorWhite);
        z-index: 2;
      }
      :host > .io-icon:not([value=' ']) {
        margin: 0 var(--io_spacing2) 0 0;
      }
      :host > .io-tab-drop-marker {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: var(--io_bgColorBlue);
        border-bottom-right-radius: var(--io_borderRadius);
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
      :host:not(:hover) > .io-close-icon {
        opacity: 0;
        transform: scale(0.2);
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host:hover > .io-close-icon {
        opacity: 1;
        transform: scale(0.4);
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity linear 0.2s;
      }
      :host > .io-close-icon {
        position: absolute;
        right: var(--io_spacing);
        top: var(--io_spacing);
        pointer-events: inherit;
        background: linear-gradient(to right, transparent 0%, var(--io_bgColor) 5%);
      }
      :host[selected] > .io-close-icon {
        background: linear-gradient(to right, transparent 0%, var(--io_bgColorLight) 5%);
      }
      :host > .io-close-icon:hover {
        transform: scale(0.5);
        fill: var(--io_colorStrong);
        stroke: var(--io_colorStrong);
      }
    `
  }

  @ReactiveProperty({type: Tab})
  declare tab: Tab

  @ReactiveProperty({type: Boolean, reflect: true})
  declare overflow: boolean

  static get Listeners() {
    return {
      'click': 'preventDefault',
      'contextmenu': 'preventDefault',
    }
  }

  constructor(args: IoTabProps) { super(args) }

  onResized() {
    const span = this.querySelector('span')!
    this.overflow = span.scrollWidth > span.clientWidth
  }
  onTouchmove(event: TouchEvent) {
    event.preventDefault()
  }
  preventDefault(event: Event) {
    event.stopPropagation()
    event.preventDefault()
  }
  onPointerdown(event: PointerEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.setPointerCapture(event.pointerId)
    tabDragIconSingleton.setStartPosition(event.clientX, event.clientY)
    super.onPointerdown(event)
    if (event.buttons === 2) {
      this.expandContextEditor()
    } else {
      this.focus()
    }
  }
  onPointermove(event: PointerEvent) {
    event.preventDefault()
    if (event.buttons !== 1) return
    const panel = this.parentElement!.parentElement as IoPanel
    const root = this.closest('io-layout') as IoLayout
    tabDragIconSingleton.updateDrag(this.tab, panel, event.clientX, event.clientY, root)
  }
  onPointerup(event: PointerEvent) {
    event.preventDefault()
    super.onPointerup(event)
    this.releasePointerCapture(event.pointerId)
    if (tabDragIconSingleton.dragging) {
      tabDragIconSingleton.endDrag()
    } else {
      this.onClick()
    }
  }
  onPointercancel(event: PointerEvent) {
    event.preventDefault()
    event.stopPropagation()
    super.onPointercancel(event)
    tabDragIconSingleton.cancelDrag()
  }
  onPointerleave(event: PointerEvent) {
    event.preventDefault()
    event.stopPropagation()
  }
  onClick() {
    this.dispatch('io-edit-tab', {tab: this.tab, key: 'Select'}, true)
  }
  onDeleteClick() {
    this.dispatch('io-edit-tab', {tab: this.tab, key: 'Backspace'}, true)
  }
  expandContextEditor() {
    IoContextEditorSingleton.expand({
      source: this,
      direction: 'down',
      value: this.tab,
      properties: ['id', 'label', 'icon'],
      orientation: 'horizontal',
      config: [
        ['id', ioField({inert: true})],
        ['label', ioString({live: true})],
        ['icon', iconOptions],
      ],
    })
  }
  onKeydown(event: KeyboardEvent) {
    if (event.shiftKey && ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      this.dispatch('io-edit-tab', {tab: this.tab, key: event.key}, true)
    } else if (event.shiftKey && event.key === 'Enter') {
      this.expandContextEditor()
    } else {
      super.onKeydown(event)
    }
  }
  tabMutated() {
    this.changed()
  }
  changed() {
    this.setAttribute('selected', this.tab.selected)
    this.setAttribute('title', this.tab.label)
    this.render([
      this.tab.selected ? span({class: 'io-tab-drop-marker'}) : null,
      this.tab.icon ? ioIcon({value: this.tab.icon}) : null,
      span({class: 'io-tab-label'}, this.tab.label),
      ioIcon({value: 'io:close', size: 'small', class: 'io-close-icon', '@click': this.onDeleteClick, '@pointerdown': this.preventDefault}),
    ])
  }
}

export const ioTab = function(arg0: IoTabProps) {
  return IoTab.vConstructor(arg0)
}
