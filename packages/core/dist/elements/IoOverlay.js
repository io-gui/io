var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveProperty } from '../decorators/Property.js';
import { Register } from '../decorators/Register.js';
import { IoElement } from './IoElement.js';
let focusRestoreTarget = null;
/**
 * This element is designed to be used as a singleton `IoOverlaySingleton`.
 * It is a pointer-blocking element covering the entire window at a very high z-index.
 * It is designed to be displayed on top all other elements and contain elements like modals, popovers, floating menus etc.
 * When clicked, IoOverlay collapses all child elements by setting their `expanded` property to `false`.
 * Child elements should emmit bubbling `"expanded"` event when expanded/collapsed.
 **/
let IoOverlay = class IoOverlay extends IoElement {
    static get Style() {
        return /* css */ `
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
        @apply --unselectable;
      }
      :host[expanded] {
        background: rgba(0, 0, 0, 0.25);
        pointer-events: all;
      }
      :host > * {
        position: absolute !important;
        box-shadow: var(--io_shadow);
      }
    `;
    }
    static get Listeners() {
        return {
            'pointerdown': ['stopPropagation', { passive: false }],
            'pointermove': ['stopPropagation', { passive: false }],
            'pointerup': 'onPointerup',
            'contextmenu': 'onContextmenu',
            'mousedown': ['stopPropagation', { passive: false }],
            'mousemove': ['stopPropagation', { passive: false }],
            'mouseup': ['stopPropagation', { passive: false }],
            'touchstart': ['stopPropagation', { passive: false }],
            'touchmove': ['stopPropagation', { passive: false }],
            'touchend': ['stopPropagation', { passive: false }],
            'keydown': ['stopPropagation', { passive: false }],
            'keyup': ['stopPropagation', { passive: false }],
            'focusin': ['stopPropagation', { passive: false }],
            'blur': ['stopPropagation', { passive: false }],
            'scroll': 'onScroll',
            'wheel': ['onScroll', { passive: false }],
        };
    }
    constructor(args = {}) { super(args); }
    init() {
        this.expandAsChildren = this.expandAsChildren.bind(this);
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
    onPointerup(event) {
        if (event.composedPath()[0] === this) {
            this.collapse();
        }
        event.stopPropagation();
    }
    onContextmenu(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    onScroll(event) {
        if (event.composedPath()[0] === this) {
            this.collapse();
        }
    }
    onResized() {
        this.collapse();
    }
    appendChild(child) {
        super.appendChild(child);
        child.addEventListener('expanded-changed', this.onChildExpandedChanged);
        this.debounce(this.expandAsChildren);
        return child;
    }
    removeChild(child) {
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
            if (this.children[i].expanded) {
                this.expanded = true;
                return;
            }
        }
        this.expanded = false;
    }
    expandedChanged() {
        if (!this.expanded) {
            for (let i = this.children.length; i--;) {
                this.children[i].expanded = false;
            }
            if (focusRestoreTarget)
                focusRestoreTarget.focus();
        }
    }
};
__decorate([
    ReactiveProperty({ value: false, type: Boolean, reflect: true })
], IoOverlay.prototype, "expanded", void 0);
IoOverlay = __decorate([
    Register
], IoOverlay);
export const IoOverlaySingleton = new IoOverlay();
setTimeout(() => {
    document.body.appendChild(IoOverlaySingleton);
}, 100);
// TODO: Test
window.addEventListener('focusin', () => {
    focusRestoreTarget = document.activeElement;
}, { capture: false });
window.addEventListener('blur', () => {
    setTimeout(() => {
        if (!IoOverlaySingleton.expanded && document.activeElement === document.body) {
            focusRestoreTarget = null;
        }
    });
}, { capture: true });
//# sourceMappingURL=IoOverlay.js.map