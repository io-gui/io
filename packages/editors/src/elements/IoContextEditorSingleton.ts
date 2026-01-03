import { IoOverlaySingleton, NudgeDirection, nudge, ReactiveProperty, Register } from '@io-gui/core'
import { IoPropertyEditor } from './IoPropertyEditor.js'
import { PropertyConfig } from '../utils/EditorConfig.js'
import { EditorGroups } from '../utils/EditorGroups.js'
import { EditorWidgets } from '../utils/EditorWidgets.js'

interface IoContextEditorExpandProps {
  source: HTMLElement
  direction: NudgeDirection
  value: any
  properties?: string[]
  labeled?: boolean
  orientation?: 'vertical' | 'horizontal'
  config?: PropertyConfig[]
  groups?: EditorGroups
  widgets?: EditorWidgets
  onClose?: () => void
}

@Register
class IoContextEditor extends IoPropertyEditor {
  static get Style() {
    return /* css */`
      :host {
        z-index: 2;
      }
      :host:not([expanded]) {
      visibility: hidden;
    }
    `
  }

  @ReactiveProperty({type: Boolean, value: false, reflect: true})
  declare expanded: boolean

  declare onClose: null | (() => void)

  static get Listeners() {
    return {
      'keydown': 'onKeydown',
      'io-focus-to': 'onIoFocusTo',
    }
  }
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.key === 'Enter') {
      event.preventDefault()
      this.expanded = false
    }
  }
  onIoFocusTo(event: CustomEvent) {
    const source = event.detail.source
    const cmd = event.detail.command
    const siblings = Array.from(this.querySelectorAll('[tabindex="0"]')) as HTMLElement[]
    const index = [...siblings].indexOf(source)

    let cmdOverride = ''
    if ((this as any).horizontal) {
      if (cmd === 'ArrowRight') cmdOverride = 'next'
      if (cmd === 'ArrowLeft') cmdOverride = 'prev'
    } else {
      if (cmd === 'ArrowDown') cmdOverride = 'next'
      if (cmd === 'ArrowUp') cmdOverride = 'prev'
    }

    if (cmdOverride) {
      if (cmdOverride === 'next') {
        siblings[(index + 1) % siblings.length].focus()
      } else if (cmdOverride === 'prev') {
        siblings[(index - 1 + siblings.length) % siblings.length].focus()
      } else if (cmdOverride === 'out') {
        if ((this as any).$parent) (this as any).$parent.focus()
      }
      event.stopPropagation()
    }
  }
  expand(props: IoContextEditorExpandProps) {
    this.setProperties({
      value: props.value,
      properties: props.properties || [],
      labeled: props.labeled || true,
      orientation: props.orientation || 'vertical',
      config: props.config || [],
      groups: props.groups || new Map(),
      widgets: props.widgets || new Map(),
      expanded: true,
    })
    this.onClose = props.onClose || null
    // TODO: nudge: 'none' should open at cursor position like context menu
    nudge(this, props.source, props.direction)
    this.debounce(this.onExpand)
  }
  onExpand() {
    (this.querySelector('[tabindex="0"]:not([inert])') as HTMLElement)?.focus()
    // TODO: keyboard focus navigation
  }
  expandedChanged() {
    if (!this.expanded) {
      this.setProperties({
        value: {},
        properties: [],
        labeled: true,
        orientation: 'vertical',
        config: [],
        groups: new Map(),
        widgets: new Map(),
      })
      if (this.onClose) {
        this.onClose()
        this.onClose = null
      }
    }
  }
}

export const IoContextEditorSingleton = new IoContextEditor()

setTimeout(() => {
  IoOverlaySingleton.appendChild(IoContextEditorSingleton as HTMLElement)
}, 100)
