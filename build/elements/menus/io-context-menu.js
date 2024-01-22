var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '../../core/node.js';
import { IoElement } from '../../core/element.js';
import { IoOverlaySingleton as Overlay } from '../../core/overlay.js';
import { IoMenuOptions } from './io-menu-options.js';
import { Property } from '../../core/internals/property.js';
import { MenuOptions } from './models/menu-options.js';
// import { getMenuDescendants, IoMenuItem } from './io-menu-item.js';
/**
 * An invisible element that inserts a floating menu when its `parentElement` is clicked. Menu position is set by the pointer by default but it can be configured to expand to the side of the parent element by setting the `position` property. Default `button` property for menu expansion is `0` (left mouse button), but it can be configured for other buttons. You can have multiple `IoContextMenu` instances under the same `parentElement` as long as the `button` properties are different.
 **/
let IoContextMenu = class IoContextMenu extends IoElement {
    static get Properties() {
        return {
            $options: null,
        };
    }
    connectedCallback() {
        super.connectedCallback();
        Overlay.addEventListener('pointermove', this._onOverlayPointermove);
        this._parent = this.parentElement;
        this._parent.addEventListener('pointerdown', this._onPointerdown);
        this._parent.addEventListener('click', this._onClick);
        this._parent.addEventListener('contextmenu', this._onContextmenu);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.$options && this.$options.parentElement)
            Overlay.removeChild(this.$options);
        Overlay.removeEventListener('pointermove', this._onOverlayPointermove);
        this._parent.removeEventListener('pointerdown', this._onPointerdown);
        this._parent.removeEventListener('contextmenu', this._onContextmenu);
        this._parent.removeEventListener('pointermove', this._onPointermove);
        this._parent.removeEventListener('pointerup', this._onPointerup);
        this._parent.removeEventListener('click', this._onClick);
        delete this._parent;
    }
    getBoundingClientRect() {
        return this._parent.getBoundingClientRect();
    }
    _onItemClicked(event) {
        const item = event.composedPath()[0];
        const d = event.detail;
        if (item !== this) {
            event.stopImmediatePropagation();
            this.dispatchEvent('item-clicked', d, true);
            this.throttle(this._onCollapse);
        }
    }
    _onContextmenu(event) {
        if (this.button === 2)
            event.preventDefault();
    }
    _onPointerdown(event) {
        Overlay.x = event.clientX;
        Overlay.y = event.clientY;
        this._parent.addEventListener('pointermove', this._onPointermove);
        this._parent.addEventListener('pointerup', this._onPointerup);
        clearTimeout(this._contextTimeout);
        if (event.pointerType !== 'touch') {
            if (event.button === this.button) {
                this.setPointerCapture(event.pointerId);
                this.expanded = true;
            }
        }
        else {
            // iOS Safari contextmenu event emulation.
            event.preventDefault();
            this._contextTimeout = setTimeout(() => {
                this.setPointerCapture(event.pointerId);
                this.expanded = true;
            }, 150);
        }
    }
    _onPointermove(event) {
        clearTimeout(this._contextTimeout);
        if (this.expanded) {
            this.$options?.querySelector('io-menu-item')?._onPointermoveAction(event);
        }
    }
    _onPointerup(event) {
        clearTimeout(this._contextTimeout);
        this.releasePointerCapture(event.pointerId);
        if (this.expanded) {
            this.$options?.querySelector('io-menu-item')?._onPointerupAction(event, true);
        }
        this._parent.removeEventListener('pointermove', this._onPointermove);
        this._parent.removeEventListener('pointerup', this._onPointerup);
    }
    _onOverlayPointermove(event) {
        if (this.expanded)
            this._onPointermove(event);
    }
    _onClick(event) {
        if (event.button === this.button && event.button !== 2)
            this.expanded = true;
    }
    _onCollapse() {
        this.expanded = false;
    }
    optionsChanged() {
        if (this.$options) {
            Overlay.removeChild(this.$options);
            this.$options.template([]);
            this.$options.dispose();
        }
        this.$options = new IoMenuOptions({
            expanded: this.bind('expanded'),
            inlayer: true,
            options: this.options,
            direction: 'pointer',
            $parent: this,
            '@item-clicked': this._onItemClicked,
        });
        Overlay.appendChild(this.$options);
    }
};
__decorate([
    Property({ observe: true, type: MenuOptions })
], IoContextMenu.prototype, "options", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoContextMenu.prototype, "expanded", void 0);
__decorate([
    Property(0)
], IoContextMenu.prototype, "button", void 0);
IoContextMenu = __decorate([
    Register
], IoContextMenu);
export { IoContextMenu };
//# sourceMappingURL=io-context-menu.js.map