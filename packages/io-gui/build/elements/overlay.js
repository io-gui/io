var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property } from '../core/decorators/property';
import { Register } from '../core/decorators/register';
import { IoElement } from '../core/element';
let lastFocus = null;
window.addEventListener('focusin', () => {
    lastFocus = document.activeElement;
}, { capture: false });
window.addEventListener('blur', () => {
    setTimeout(() => {
        if (document.activeElement === document.body) {
            lastFocus = null;
        }
    });
}, { capture: true });
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
        user-select: none;
        overflow: hidden;
        pointer-events: none;
        touch-action: none;
        background: transparent;
      }
      :host[expanded] {
        pointer-events: all;
      }
      :host > * {
        position: absolute !important;
        touch-action: none;
        box-shadow: var(--io_shadow);
      }
    `;
    }
    static get Listeners() {
        return {
            'pointerdown': ['stopPropagation', { passive: false }],
            'pointermove': ['stopPropagation', { passive: false }],
            'pointerup': '_onPointerup',
            'contextmenu': '_onContextmenu',
            'focusin': '_onFocusIn',
            'scroll': '_onScroll',
            'wheel': ['_onScroll', { passive: false }],
            'mousedown': ['stopPropagation', { passive: false }],
            'mousemove': ['stopPropagation', { passive: false }],
            'mouseup': ['stopPropagation', { passive: false }],
            'touchstart': ['stopPropagation', { passive: false }],
            'touchmove': ['stopPropagation', { passive: false }],
            'touchend': ['stopPropagation', { passive: false }],
            'keydown': ['stopPropagation', { passive: false }],
            'keyup': ['stopPropagation', { passive: false }],
        };
    }
    constructor(properties = {}) {
        super(properties);
        Object.defineProperty(this, 'x', { value: 0, writable: true });
        Object.defineProperty(this, 'y', { value: 0, writable: true });
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
    onResized() {
        this.expanded = false;
    }
    _onPointerup(event) {
        if (event.composedPath()[0] === this) {
            this.throttle(this._onCollapse);
        }
    }
    _onCollapse() {
        this.expanded = false;
    }
    _onContextmenu(event) {
        event.preventDefault();
    }
    _onFocusIn(event) {
        event.stopPropagation();
    }
    _onScroll(event) {
        if (event.composedPath()[0] === this) {
            this.throttle(this._onCollapse);
        }
    }
    nudgeDown(element, x, y, elemRect, force) {
        x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
        const fits = y + elemRect.height < window.innerHeight;
        if (fits || force) {
            if (!fits)
                y = window.innerHeight - elemRect.height;
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            return true;
        }
        return false;
    }
    nudgeUp(element, x, y, elemRect, force) {
        x = Math.max(0, Math.min(x, window.innerWidth - elemRect.width));
        const fits = y - elemRect.height > 0;
        if (fits || force) {
            if (!fits)
                y = 0;
            element.style.left = x + 'px';
            element.style.top = y - elemRect.height + 'px';
            return true;
        }
        return false;
    }
    nudgeRight(element, x, y, elemRect, force) {
        const fits = x + elemRect.width < window.innerWidth;
        if (fits || force) {
            if (!fits)
                x = window.innerWidth - elemRect.width;
            element.style.left = x + 'px';
            element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
            return true;
        }
        return false;
    }
    nudgeLeft(element, x, y, elemRect, force) {
        const fits = x - elemRect.width > 0;
        if (fits || force) {
            if (!fits)
                x = 0;
            element.style.left = x - elemRect.width + 'px';
            element.style.top = Math.min(y, window.innerHeight - elemRect.height) + 'px';
            return true;
        }
        return false;
    }
    nudgePointer(element, x, y, elemRect) {
        element.style.left = Math.max(0, Math.min(x, window.innerWidth - elemRect.width)) + 'px';
        element.style.top = Math.max(0, Math.min(y, window.innerHeight - elemRect.height)) + 'px';
        return true;
    }
    setElementPosition(element, direction, srcRect) {
        const elemRect = element.getBoundingClientRect();
        const left = srcRect.left;
        const top = srcRect.top;
        const right = srcRect.right;
        const bottom = srcRect.bottom;
        const bottomToHeight = window.innerHeight - bottom;
        const rightToWidth = window.innerWidth - right;
        switch (direction) {
            case 'pointer':
                this.nudgePointer(element, this.x + 5, this.y + 5, elemRect);
                break;
            case 'up':
                this.nudgeUp(element, left, top, elemRect) ||
                    this.nudgeDown(element, left, bottom, elemRect) ||
                    this.nudgeUp(element, left, top, elemRect, top > bottomToHeight) ||
                    this.nudgeDown(element, left, bottom, elemRect, top <= bottomToHeight);
                break;
            case 'left':
                this.nudgeLeft(element, left, top, elemRect) ||
                    this.nudgeRight(element, right, top, elemRect) ||
                    this.nudgeLeft(element, left, top, elemRect, left > rightToWidth) ||
                    this.nudgeRight(element, right, top, elemRect, left <= rightToWidth);
                break;
            case 'down':
                this.nudgeDown(element, left, bottom, elemRect) ||
                    this.nudgeUp(element, left, top, elemRect) ||
                    this.nudgeDown(element, left, bottom, elemRect, bottomToHeight > top) ||
                    this.nudgeUp(element, left, top, elemRect, bottomToHeight <= top);
                break;
            case 'right':
            default:
                this.nudgeRight(element, right, top, elemRect) ||
                    this.nudgeLeft(element, left, top, elemRect) ||
                    this.nudgeRight(element, right, top, elemRect, rightToWidth > left) ||
                    this.nudgeLeft(element, left, top, elemRect, rightToWidth <= left);
                break;
        }
    }
    appendChild(child) {
        super.appendChild(child);
        child.addEventListener('expanded-changed', this.onChildExpanded);
        this.onChildExpanded();
    }
    removeChild(child) {
        super.removeChild(child);
        child.removeEventListener('expanded-changed', this.onChildExpanded);
        this.onChildExpanded();
    }
    onChildExpanded() {
        this.throttle(this.onChildExpandedDelayed);
    }
    onChildExpandedDelayed() {
        for (let i = this.children.length; i--;) {
            if (this.children[i].expanded) {
                this.expanded = true;
                return;
            }
        }
        this.throttle(this._onCollapse);
    }
    expandedChanged() {
        if (!this.expanded) {
            for (let i = this.children.length; i--;) {
                this.children[i].expanded = false;
            }
            if (lastFocus)
                lastFocus.focus();
        }
    }
};
__decorate([
    Property({ value: false, type: Boolean, reflect: true })
], IoOverlay.prototype, "expanded", void 0);
IoOverlay = __decorate([
    Register
], IoOverlay);
export const IoOverlaySingleton = new IoOverlay();
document.body.appendChild(IoOverlaySingleton);
//# sourceMappingURL=overlay.js.map