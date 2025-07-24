import { ReactiveProperty } from '../decorators/Property.js';
import { Register } from '../decorators/Register.js';
import { ListenerDefinitions } from '../nodes/Node.js';
import { IoElement, IoElementProps } from './IoElement.js';

let focusRestoreTarget: Element | null = null;

/**
 * This element is designed to be used as a singleton `IoOverlaySingleton`.
 * It is a pointer-blocking element covering the entire window at a very high z-index.
 * It is designed to be displayed on top all other elements and contain elements like modals, popovers, floating menus etc.
 * When clicked, IoOverlay collapses all child elements by setting their `expanded` property to `false`.
 * Child elements should emmit bubbling `"expanded"` event when expanded/collapsed.
 **/
@Register
class IoOverlay extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 100000;
        user-select: none;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
        background: transparent;
      }
      :host[expanded] {
        background: rgba(0, 0, 0, 0.25);
        pointer-events: all;
      }
      :host > * {
        position: absolute !important;
        box-shadow: var(--io_shadow);
      }
      :host * {
        touch-action: none;
      }
    `;
  }
  @ReactiveProperty({value: false, type: Boolean, reflect: true})
  declare expanded: boolean;

  static get Listeners(): ListenerDefinitions {
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
    };
  }

  constructor(args: IoElementProps = {}) { super(args); }

  init() {
    this.expandAsChildren = this.expandAsChildren.bind(this);
  }
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  onPointerup(event: PointerEvent) {
    if (event.composedPath()[0] === this as unknown as EventTarget) {
      this.collapse();
    }
    event.stopPropagation();
  }
  onContextmenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
  onScroll(event: Event) {
    if (event.composedPath()[0] === this as unknown as EventTarget) {
      this.collapse();
    }
  }
  onResized() {
    this.collapse();
  }
  appendChild<El extends Node>(child: El) {
    super.appendChild(child);
    child.addEventListener('expanded-changed', this.onChildExpandedChanged);
    this.debounce(this.expandAsChildren);
    return child;
  }
  removeChild<El extends Node>(child: El) {
    super.removeChild(child);
    child.removeEventListener('expanded-changed', this.onChildExpandedChanged);
    this.debounce(this.expandAsChildren);
    return child;
  }
  onChildExpandedChanged() {
    this.debounce(this.expandAsChildren);
  }
  collapse() {
    for (let i = this.children.length; i--;) {
      this.expanded = false;
    }
    this.expanded = false;
  }
  expandAsChildren() {
    for (let i = this.children.length; i--;) {
      if ((this.children[i] as any).expanded) {
        this.expanded = true;
        return;
      }
    }
    this.expanded = false;
  }
  expandedChanged() {
    if (!this.expanded) {
      for (let i = this.children.length; i--;) {
        (this.children[i] as any).expanded = false;
      }
      if (focusRestoreTarget) (focusRestoreTarget as HTMLElement).focus();
    }
  }
}

export const IoOverlaySingleton = new IoOverlay();

setTimeout(() => {
  document.body.appendChild(IoOverlaySingleton as HTMLElement);
}, 100);

// TODO: Test
window.addEventListener('focusin', () => {
  focusRestoreTarget = document.activeElement;
}, {capture: false});

window.addEventListener('blur', () => {
  setTimeout(() => {
    if (!IoOverlaySingleton.expanded && document.activeElement === document.body) {
      focusRestoreTarget = null;
    }
  });
}, {capture: true});