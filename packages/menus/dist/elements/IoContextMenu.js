var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, IoOverlaySingleton as Overlay } from '@io-gui/core';
import { IoMenuOptions } from './IoMenuOptions.js';
import { onOverlayPointerdown, onOverlayPointermove, onOverlayPointeup } from './IoMenuItem.js';
import { MenuOption } from '../nodes/MenuOption.js';
/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked.
 * Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element
 * by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button),
 * but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same
 * `parentElement` as long as the `button` properties are different.
 **/
let IoContextMenu = class IoContextMenu extends IoElement {
    static get ReactiveProperties() {
        return {
            $options: null,
        };
    }
    constructor(args) {
        super(args);
        this.$options = new IoMenuOptions({
            expanded: this.bind('expanded'),
            option: this.option,
            $parent: this,
        });
    }
    init() {
        this.collapse = this.collapse.bind(this);
    }
    optionChanged() {
        if (this.$options)
            this.$options.option = this.option;
    }
    connectedCallback() {
        super.connectedCallback();
        Overlay.appendChild(this.$options);
        this.parentElement.addEventListener('pointerdown', this.onPointerdown);
        this.parentElement.addEventListener('click', this.onClick);
        this.parentElement.addEventListener('contextmenu', this.onContextmenu);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        Overlay.removeChild(this.$options);
        this.parentElement.removeEventListener('pointerdown', this.onPointerdown);
        this.parentElement.removeEventListener('click', this.onClick);
        this.parentElement.removeEventListener('contextmenu', this.onContextmenu);
    }
    getBoundingClientRect() {
        return this.parentElement.getBoundingClientRect();
    }
    onContextmenu(event) {
        if (this.button === 2)
            event.preventDefault();
    }
    onPointerdown(event) {
        event.stopPropagation();
        this.$options.style.left = `${event.clientX}px`;
        this.$options.style.top = `${event.clientY}px`;
        this.parentElement.addEventListener('pointermove', this.onPointermove);
        this.parentElement.addEventListener('pointerleave', this.onPointerleave);
        this.parentElement.addEventListener('pointerup', this.onPointerup);
        clearTimeout(this._contextTimeout);
        if (event.pointerType !== 'touch') {
            if (event.button === this.button) {
                this.setPointerCapture(event.pointerId);
                this.expanded = true;
                // TODO: keyboard focus navigation
            }
        }
        else {
            // iOS Safari contextmenu event emulation.
            event.preventDefault();
            this._contextTimeout = setTimeout(() => {
                this.setPointerCapture(event.pointerId);
                this.expanded = true;
                // TODO: keyboard focus navigation
            }, 150);
        }
        onOverlayPointerdown.call(this, event);
    }
    onPointermove(event) {
        event.stopPropagation();
        clearTimeout(this._contextTimeout);
        if (event.pointerType === 'touch') {
            // Let touch scroll the document.
            if (!this.expanded)
                return;
        }
        onOverlayPointermove.call(this, event);
    }
    onPointerup(event) {
        clearTimeout(this._contextTimeout);
        this.releasePointerCapture(event.pointerId);
        this.parentElement.removeEventListener('pointermove', this.onPointermove);
        this.parentElement.removeEventListener('pointerleave', this.onPointerleave);
        this.parentElement.removeEventListener('pointerup', this.onPointerup);
        onOverlayPointeup.call(this, event);
    }
    onPointerleave(event) {
        this.releasePointerCapture(event.pointerId);
        this.parentElement.removeEventListener('pointermove', this.onPointermove);
        this.parentElement.removeEventListener('pointerleave', this.onPointerleave);
        this.parentElement.removeEventListener('pointerup', this.onPointerup);
    }
    collapse() {
        Overlay.collapse();
    }
};
__decorate([
    ReactiveProperty({ type: MenuOption })
], IoContextMenu.prototype, "option", void 0);
__decorate([
    ReactiveProperty({ value: false, reflect: true })
], IoContextMenu.prototype, "expanded", void 0);
__decorate([
    ReactiveProperty(0)
], IoContextMenu.prototype, "button", void 0);
IoContextMenu = __decorate([
    Register
], IoContextMenu);
export { IoContextMenu };
export const ioContextMenu = function (arg0) {
    return IoContextMenu.vConstructor(arg0);
};
//# sourceMappingURL=IoContextMenu.js.map