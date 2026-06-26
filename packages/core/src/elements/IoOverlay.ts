import { Property } from '../decorators/Property.js'
import { Register } from '../decorators/Register.js'
import { ListenerDefinitions } from '../nodes/ReactiveObject.js'
import { ReactiveElement, IoElementProps } from './ReactiveElement.js'

export type IoExpandable = {
  expanded: boolean
}

let focusRestoreTarget: Element | null = null

/**
 * Singleton full-window overlay; blocks pointer events when {@link expanded} and collapses children on backdrop click.
 */
@Register
class IoOverlay extends ReactiveElement {
  static override get Style() {
    return /* css */`
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100000;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
        background: transparent;
        @apply --io-unselectable;
      }
      :host[expanded] {
        background: rgba(0, 0, 0, 0.25);
        pointer-events: all;
      }
      :host > * {
        position: absolute !important;
        box-shadow: var(--io_shadow);
      }
    `
  }
  @Property({value: false, type: Boolean, reflect: true})
  declare expanded: boolean

  static override get Listeners(): ListenerDefinitions {
    return {
      'pointerdown': ['stopPropagation', {passive: false}],
      'pointermove': ['stopPropagation', {passive: false}],
      'pointerup': 'onPointerup',
      'contextmenu': 'onContextmenu',
      'mousedown': ['stopPropagation', {passive: false}],
      'mousemove': ['stopPropagation', {passive: false}],
      'mouseup': ['stopPropagation', {passive: false}],
      'touchstart': ['stopPropagation', {passive: false}],
      'touchmove': ['stopPropagation', {passive: false}],
      'touchend': ['stopPropagation', {passive: false}],
      'keydown': ['stopPropagation', {passive: false}],
      'keyup': ['stopPropagation', {passive: false}],
      'focusin': ['stopPropagation', {passive: false}],
      'blur': ['stopPropagation', {passive: false}],
      'scroll': 'onScroll',
      'wheel': ['onScroll', {passive: false}],
    }
  }

  constructor(args: IoElementProps = {}) { super(args) }

  override init() {
    this.expandAsChildren = this.expandAsChildren.bind(this)
  }
  stopPropagation(event: Event) {
    event.stopPropagation()
  }
  onPointerup(event: PointerEvent) {
    if (event.composedPath()[0] === this as unknown as EventTarget) {
      this.collapse()
    }
    event.stopPropagation()
  }
  onContextmenu(event: Event) {
    event.preventDefault()
    event.stopPropagation()
  }
  onScroll(event: Event) {
    if (event.composedPath()[0] === this as unknown as EventTarget) {
      this.collapse()
    }
  }
  onResized() {
    this.collapse()
  }
  override appendChild<El extends Node>(child: El) {
    super.appendChild(child)
    child.addEventListener('expanded-changed', this.onChildExpandedChanged)
    this.debounce(this.expandAsChildren)
    return child
  }
  override removeChild<El extends Node>(child: El) {
    super.removeChild(child)
    child.removeEventListener('expanded-changed', this.onChildExpandedChanged)
    this.debounce(this.expandAsChildren)
    return child
  }
  onChildExpandedChanged() {
    this.debounce(this.expandAsChildren)
  }
  collapse() {
    for (let i = this.children.length; i--;) {
      this.expanded = false
    }
    this.expanded = false
  }
  expandAsChildren() {
    for (let i = this.children.length; i--;) {
      if ((this.children[i] as unknown as IoExpandable).expanded) {
        this.expanded = true
        return
      }
    }
    this.expanded = false
  }
  expandedChanged() {
    if (!this.expanded) {
      for (let i = this.children.length; i--;) {
        (this.children[i] as unknown as IoExpandable).expanded = false
      }
      if (focusRestoreTarget) (focusRestoreTarget as HTMLElement).focus()
    }
  }
}

export const IoOverlaySingleton = new IoOverlay()

setTimeout(() => {
  document.body.appendChild(IoOverlaySingleton as HTMLElement)
}, 100)

// TODO: Test
window.addEventListener('focusin', () => {
  focusRestoreTarget = document.activeElement
}, {capture: false})

window.addEventListener('blur', () => {
  setTimeout(() => {
    if (!IoOverlaySingleton.expanded && document.activeElement === document.body) {
      focusRestoreTarget = null
    }
  })
}, {capture: true})