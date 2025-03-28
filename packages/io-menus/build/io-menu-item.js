var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, IoOverlaySingleton as Overlay, IoField } from 'io-gui';
import { MenuItem } from './models/menu-item.js';
import { IoMenuOptions } from './io-menu-options.js';
const MenuElementTags = ['io-menu-item', 'io-menu-hamburger', 'io-option-menu'];
const MenuElementTagsSelector = MenuElementTags.join(', ');
/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/
// TODO: fix and improve keyboard navigation in all cases.
let IoMenuItem = class IoMenuItem extends IoField {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        user-select: none;
      }
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
      :host > .label {
        flex: 1 1 auto;
        padding: 0 var(--io_spacing2);
      }
      :host > .hint {
        flex: 0 1 auto;
        opacity: 0.25;
        padding: 0 var(--io_spacing2);
      }
      :host > .hasmore {
        opacity: 0.5;
      }
    `;
    }
    static get Listeners() {
        return {
            'click': 'preventDefault',
        };
    }
    preventDefault(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    get hasmore() {
        return this.item.hasmore && this.depth > 0;
    }
    get inlayer() {
        return !!this.$parent && !!this.$parent.inlayer;
    }
    get $parent() {
        return this.parentElement;
    }
    connectedCallback() {
        super.connectedCallback();
        // TODO: remove event listeners and find a better way to handle this.
        Overlay.addEventListener('pointermove', this._onOverlayPointermove);
        Overlay.addEventListener('pointerup', this._onOverlayPointerup);
        if (this.$options)
            Overlay.appendChild(this.$options);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        Overlay.removeEventListener('pointermove', this._onOverlayPointermove);
        Overlay.removeEventListener('pointerup', this._onOverlayPointerup);
        if (this.$options && this.$options.inlayer)
            Overlay.removeChild(this.$options);
    }
    _onOverlayPointermove(event) {
        if (!this.inlayer && this.expanded)
            this._onPointermove(event);
    }
    _onOverlayPointerup(event) {
        if (!this.inlayer && this.expanded)
            this._onPointerupAction(event);
    }
    _onClick() {
        const item = this.item;
        if (this.hasmore) {
            if (!this.expanded)
                this.expanded = true;
        }
        else if (item.mode === 'toggle') {
            item.selected = !item.selected;
        }
        else {
            if (item.action) {
                item.action.apply(null, [item.value]);
            }
            if (item.mode === 'select') {
                if (item.hasmore && item.options && this.depth <= 0) {
                    item.options.selectDefault();
                }
                else {
                    item.selected = true;
                }
            }
            else if (item.mode === 'scroll') {
                item.selected = true;
            }
            else if (item.mode === 'link') {
                window.open(item.value, '_blank');
            }
            this.dispatchEvent('item-clicked', item, true);
            this.throttle(this._onCollapse);
        }
    }
    _onItemClicked(event) {
        const item = event.composedPath()[0];
        if (item !== this) {
            event.stopImmediatePropagation();
            this.dispatchEvent('item-clicked', event.detail, true);
        }
        if (this.expanded)
            this.throttle(this._onCollapse);
    }
    _onPointerdown(event) {
        event.stopPropagation();
        event.preventDefault(); // Prevents focus
        this.setPointerCapture(event.pointerId);
        this.addEventListener('pointermove', this._onPointermove);
        this.addEventListener('pointerup', this._onPointerup);
        this._onPointerdownAction(event);
    }
    _onPointerdownAction(event) {
        // TODO: why is this needed?
        if (this.expanded || event.pointerType === 'mouse' || this.inlayer) {
            this.focus();
            if (this.item.options)
                this.expanded = true;
        }
        // hovered = this;
        // hoveredParent = this.parentElement;
        // TODO: Safari temp fix for event.movement = 0
        this._x = event.clientX;
        this._y = event.clientY;
    }
    _onPointermove(event) {
        event.stopPropagation();
        this._onPointermoveAction(event);
    }
    _onPointermoveAction(event) {
        // TODO: why is this needed?
        if (!this.expanded && event.pointerType === 'touch' && !this.inlayer)
            return;
        const clipped = !!this.$parent && !!this.$parent.style.height;
        if (event.pointerType === 'touch' && clipped)
            return;
        // TODO: Safari temp fix for event.movement = 0
        const movementX = event.clientX - this._x;
        const movementY = event.clientY - this._y;
        this._x = event.clientX;
        this._y = event.clientY;
        Overlay.x = event.clientX;
        Overlay.y = event.clientY;
        clearTimeout(this._timeoutOpen);
        hovered = this._gethovered(event);
        if (hovered) {
            const v = Math.abs(movementY) - Math.abs(movementX);
            const h = hovered.parentElement.horizontal;
            if (prevHovered?.parentElement !== hovered.parentElement) {
                this._expandHovered();
            }
            else if (h ? v < -0.25 : v > 0.25) {
                this._expandHovered();
            }
            else {
                this._timeoutOpen = setTimeout(() => {
                    this._expandHovered();
                }, 100);
            }
            prevHovered = hovered;
        }
    }
    _onPointerup(event) {
        event.stopPropagation();
        this.removeEventListener('pointermove', this._onPointermove);
        this.removeEventListener('pointerup', this._onPointerup);
        this._onPointerupAction(event);
    }
    _onPointerupAction(event, skipCollapse = false) {
        const item = this._gethovered(event);
        if (item) {
            item.focus();
            item._onClick(event);
        }
        else if (!skipCollapse) {
            this.throttle(this._onCollapseRoot);
        }
        hovered = undefined;
        prevHovered = undefined;
    }
    _gethovered(event) {
        const items = getMenuDescendants(getMenuRoot(this));
        const hovered = [];
        for (let i = items.length; i--;) {
            if (isPointerAboveIoMenuItem(event, items[i])) {
                hovered.push(items[i]);
            }
        }
        if (hovered.length) {
            hovered.sort((a, b) => {
                return a.depth < b.depth ? 1 : a.depth > b.depth ? -1 : 0;
            });
            return hovered[hovered.length - 1];
        }
        return undefined;
    }
    _expandHovered() {
        if (hovered) {
            hovered.focus();
            if (hovered.hasmore) {
                if (hovered.$options) {
                    const descendants = getMenuDescendants(hovered.$options);
                    for (let i = descendants.length; i--;) {
                        descendants[i].expanded = false;
                    }
                }
                hovered.expanded = true;
            }
            if (hovered.$parent) {
                // Collapse all sibiling io-menu-item elements
                const items = hovered.$parent.querySelectorAll(MenuElementTagsSelector);
                for (let i = items.length; i--;) {
                    if (items[i] !== hovered)
                        items[i].expanded = false;
                }
            }
        }
    }
    _onKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this._onClick();
            return;
        }
        else if (event.key === 'Escape') {
            event.preventDefault();
            this.throttle(this._onCollapseRoot);
            return;
        }
        let command = '';
        if (this.direction === 'left' || this.direction === 'right') {
            if (event.key === 'ArrowUp')
                command = 'prev';
            if (event.key === 'ArrowRight')
                command = 'in';
            if (event.key === 'ArrowDown')
                command = 'next';
            if (event.key === 'ArrowLeft')
                command = 'out';
        }
        else {
            if (event.key === 'ArrowUp')
                command = 'out';
            if (event.key === 'ArrowRight')
                command = 'next';
            if (event.key === 'ArrowDown')
                command = 'in';
            if (event.key === 'ArrowLeft')
                command = 'prev';
        }
        if (this.inlayer && event.key === 'Tab')
            command = 'next';
        const siblings = this.$parent ? [...this.$parent.children] : [];
        const index = siblings.indexOf(this);
        if (command) {
            // if (command && (this.inlayer || this.expanded)) {
            event.preventDefault();
            switch (command) {
                case 'prev': {
                    const prev = siblings[(index + siblings.length - 1) % (siblings.length)];
                    this.expanded = false;
                    if (prev) {
                        if (prev.hasmore)
                            prev.expanded = true;
                        prev.focus();
                    }
                    break;
                }
                case 'next': {
                    const next = siblings[(index + 1) % (siblings.length)];
                    this.expanded = false;
                    if (next) {
                        if (next.hasmore)
                            next.expanded = true;
                        next.focus();
                    }
                    break;
                }
                case 'in':
                    if (this.$options && this.$options.children.length)
                        this.$options.children[0].focus();
                    break;
                case 'out':
                    this.expanded = false;
                    if (this.$parent && this.$parent.$parent) {
                        this.$parent.$parent.focus();
                    }
                    break;
                default:
                    break;
            }
        }
        else {
            super._onKeydown(event);
        }
    }
    _onCollapse() {
        this.expanded = false;
    }
    _onCollapseRoot() {
        getMenuRoot(this).expanded = false;
    }
    expandedChanged() {
        if (this.expanded && this.depth > 0) {
            if (this.item.options && this.$options === undefined) {
                this.$options = new IoMenuOptions({
                    expanded: this.bind('expanded'),
                    inlayer: true,
                    depth: this.depth - 1,
                    options: this.item.options,
                    direction: this.direction,
                    $parent: this,
                });
            }
            // Colapse all siblings and their ancestors
            const $allitems = getMenuDescendants(getMenuRoot(this));
            const $ancestoritems = getMenuAncestors(this);
            const $descendants = getMenuDescendants(this);
            for (let i = $allitems.length; i--;) {
                if ($allitems[i] !== this && $ancestoritems.indexOf($allitems[i]) === -1 && $descendants.indexOf($allitems[i]) === -1) {
                    $allitems[i].expanded = false;
                }
            }
        }
        if (this.$options) {
            if (this.expanded) {
                if (this.$options.parentElement !== Overlay)
                    Overlay.appendChild(this.$options);
                this.$options.addEventListener('item-clicked', this._onItemClicked);
            }
            else {
                this.$options.removeEventListener('item-clicked', this._onItemClicked);
            }
            const $descendants = getMenuDescendants(this.$options);
            for (let i = $descendants.length; i--;)
                $descendants[i].expanded = false;
        }
    }
    itemChanged() {
        this.setProperties({
            selected: this.item.bind('selected'),
            disabled: this.item.bind('disabled'),
        });
    }
    changed() {
        if (this.$options !== undefined && this.item.options) {
            this.$options.options = this.item.options;
        }
        const icon = this.icon || this.item.icon;
        this.setAttribute('hidden', this.item.hidden);
        this.setAttribute('hasmore', this.hasmore);
        this.template([
            this.hasmore && this.direction === 'left' ? ['io-icon', { class: 'hasmore', icon: 'menu:triangle_left' }] : null,
            this.hasmore && this.direction === 'up' ? ['io-icon', { class: 'hasmore', icon: 'menu:triangle_up' }] : null,
            icon ? ['io-icon', { icon: icon }] : null,
            this.item.label ? ['span', { class: 'label' }, this.item.label] : null,
            this.item.hint ? ['span', { class: 'hint' }, this.item.hint] : null,
            this.hasmore && this.direction === 'right' ? ['io-icon', { class: 'hasmore', icon: 'menu:triangle_right' }] : null,
            this.hasmore && this.direction === 'down' ? ['io-icon', { class: 'hasmore', icon: 'menu:triangle_down' }] : null,
        ]);
    }
};
__decorate([
    Property({ type: MenuItem })
], IoMenuItem.prototype, "item", void 0);
__decorate([
    Property({ value: false, reflect: true })
], IoMenuItem.prototype, "expanded", void 0);
__decorate([
    Property({ value: 'right', reflect: true })
], IoMenuItem.prototype, "direction", void 0);
__decorate([
    Property({ value: 1000, reflect: true })
], IoMenuItem.prototype, "depth", void 0);
IoMenuItem = __decorate([
    Register
], IoMenuItem);
export { IoMenuItem };
export function getMenuDescendants(element) {
    const descendants = [];
    if (element.$options) {
        if (element.expanded) {
            descendants.push(element.$options);
            const items = element.$options.querySelectorAll(MenuElementTagsSelector);
            for (let i = items.length; i--;) {
                descendants.push(items[i]);
                if (items[i].expanded)
                    descendants.push(...getMenuDescendants(items[i]));
            }
        }
    }
    else {
        const items = element.querySelectorAll(MenuElementTagsSelector);
        for (let i = items.length; i--;) {
            descendants.push(items[i]);
            if (items[i].expanded)
                descendants.push(...getMenuDescendants(items[i]));
        }
    }
    return descendants;
}
export function getMenuAncestors(element) {
    const ancestors = [];
    let item = element;
    while (item && item.$parent) {
        item = item.$parent;
        if (item)
            ancestors.push(item);
    }
    return ancestors;
}
export function getMenuRoot(element) {
    let first = element;
    while (first && first.$parent) {
        first = first.$parent;
    }
    return first;
}
function isPointerAboveIoMenuItem(event, element) {
    if (MenuElementTags.indexOf(element.localName) !== -1) {
        if (!element.disabled && !element.hidden) {
            if (!element.inlayer || (element.parentElement.expanded && Overlay.expanded)) {
                const bw = 1; // TODO: temp hack to prevent picking items below through margin(1px) gaps.
                const r = element.getBoundingClientRect();
                const x = event.clientX;
                const y = event.clientY;
                const hovered = (r.top <= y + bw && r.bottom >= y - bw && r.left <= x + bw && r.right >= x - bw);
                return hovered;
            }
        }
    }
    return null;
}
let hovered;
let prevHovered;
//# sourceMappingURL=io-menu-item.js.map