var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, IoOverlaySingleton as Overlay, Property, nudge, span } from 'io-core';
import { ioField, ioString } from 'io-inputs';
import { MenuOption } from '../nodes/MenuOption.js';
import { ioMenuItem } from './IoMenuItem.js';
import { getMenuDescendants, getMenuSiblings } from '../utils/MenuDOMUtils.js';
import { searchMenuOption } from '../utils/MenuNodeUtils.js';
/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu options are displayed in horizontal direction.
 **/
let IoMenuOptions = class IoMenuOptions extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: calc(var(--io_spacing) + var(--io_borderWidth));
      transition: opacity 0.3s ease-in-out;
      @apply --unselectable;
    }
    :host[horizontal] {
      padding: var(--io_spacing) 0;
      flex-direction: row;
      align-self: stretch;
    }
    :host[inoverlay] {
      overflow-y: auto;
      box-shadow: 1px 1px 16px var(--io_shadowColor),
                  1px 1px 8px var(--io_shadowColor), 
                  1px 1px 4px var(--io_shadowColor);
    }
    :host[inoverlay]:not([expanded]) {
      visibility: hidden;
      opacity: 0;
    }
    :host > io-menu-item[hidden] ~ span.divider {
      display: none;
    }
    :host > span.divider {
      flex: 0 0 0;
      border: var(--io_border);
      border-color: var(--io_borderColorInset);
      margin: var(--io_spacing) 0;
      opacity: 0.1;
    }
    :host[horizontal] > span.divider {
      margin: 0 var(--io_spacing);
    }
    :host[horizontal] > io-menu-item > .hint {
      display: none;
    }
    :host:not([horizontal]) > #search {
      margin: var(--io_spacing);
      margin-top: 0;
    }
    :host[horizontal] > #search {
      margin: 0 var(--io_spacing);
      flex: 0 0 10em;
    }
    `;
    }
    static get Listeners() {
        return {
            'touchstart': ['stopPropagation'],
            'io-focus-to': 'onIoFocusTo',
        };
    }
    get inoverlay() {
        return Overlay.contains(this.parentElement);
    }
    constructor(args = {}) { super(args); }
    stopPropagation(event) {
        if (this.inoverlay) {
            // TODO: Prevent pull-down-to-refresh on scrollable menus.
            // Stops overlay from capturing touch events
            event.stopPropagation();
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.inoverlay) {
            this.setAttribute('inoverlay', 'true');
        }
    }
    onIoFocusTo(event) {
        const source = event.detail.source;
        const cmd = event.detail.command;
        const siblings = getMenuSiblings(source);
        const index = siblings.indexOf(source);
        const inoverlay = this.inoverlay;
        let parentIsAbove = false;
        let parentIsBelow = false;
        let parentIsLeft = false;
        let parentIsRight = false;
        if (this.$parent) {
            const rect = this.getBoundingClientRect();
            const parentRect = this.$parent.getBoundingClientRect();
            parentIsAbove = rect.top > parentRect.top;
            parentIsBelow = rect.bottom < parentRect.bottom;
            parentIsLeft = rect.left > parentRect.left;
            parentIsRight = rect.right < parentRect.right;
        }
        let cmdOverride = '';
        if (this.horizontal) {
            if (cmd === 'ArrowRight' && inoverlay)
                cmdOverride = 'Next';
            if (cmd === 'ArrowLeft' && inoverlay)
                cmdOverride = 'Prev';
            if (cmd === 'ArrowUp' && parentIsAbove)
                cmdOverride = 'Out';
            if (cmd === 'ArrowDown' && parentIsBelow)
                cmdOverride = 'Out';
        }
        else {
            if (cmd === 'ArrowDown' && inoverlay)
                cmdOverride = 'Next';
            if (cmd === 'ArrowUp' && inoverlay)
                cmdOverride = 'Prev';
            if (cmd === 'ArrowLeft' && parentIsLeft)
                cmdOverride = 'Out';
            if (cmd === 'ArrowRight' && parentIsRight)
                cmdOverride = 'Out';
        }
        if (cmd === 'Tab' && inoverlay)
            cmdOverride = 'Next';
        if (cmdOverride) {
            if (cmdOverride === 'Next') {
                siblings[(index + 1) % siblings.length].focus();
            }
            else if (cmdOverride === 'Prev') {
                siblings[(index - 1 + siblings.length) % siblings.length].focus();
            }
            else if (cmdOverride === 'Out') {
                if (this.$parent)
                    this.$parent.focus();
            }
            event.stopPropagation();
        }
    }
    collapse() {
        const optionWasFocused = this.contains(document.activeElement);
        const searchHadInput = this.searchable && !!this.search;
        getMenuDescendants(this).forEach(descendant => {
            descendant.expanded = false;
        });
        this.expanded = false;
        if (searchHadInput && optionWasFocused && !this.inoverlay) {
            this.search = '';
            this.$.search.focus();
        }
    }
    expandedChanged() {
        if (this.expanded) {
            if (this.inoverlay) {
                this.debounce(this.onExpandInOverlay);
            }
        }
        else {
            this.style.top = '';
            this.style.height = '';
            this.scrollTop = 0;
            this.search = '';
        }
    }
    searchChanged() {
        // TODO: focus drifts when filtered option is clicked
        if (this.inoverlay && this.$parent) {
            this.debounce(this.onExpandInOverlay);
        }
    }
    // TODO: Move functionality to Overlay
    onExpandInOverlay() {
        if (this.$parent) {
            nudge(this, this.$parent, this.direction, true);
        }
    }
    changed() {
        const vChildren = this.widget ? [this.widget] : [];
        if (this.searchable) {
            vChildren.push(ioString({
                id: 'search',
                role: 'search',
                value: this.bind('search'),
                placeholder: 'Search',
                live: true
            }));
        }
        if (this.search) {
            const filteredItems = searchMenuOption(this.option, this.search, this.depth);
            if (filteredItems.length === 0) {
                vChildren.push(ioField({ label: 'No matches' }));
            }
            else {
                for (let i = 0; i < filteredItems.length; i++) {
                    vChildren.push(ioMenuItem({ option: filteredItems[i], depth: 0 }));
                    if (i < filteredItems.length - 1) {
                        vChildren.push({ tag: 'span', props: { class: 'divider' } });
                    }
                }
            }
        }
        else {
            let direction = this.horizontal ? 'down' : 'right';
            if (this.horizontal && this.direction === 'up') {
                direction = 'up';
            }
            for (let i = 0; i < this.option.options.length; i++) {
                vChildren.push(ioMenuItem({
                    option: this.option.options[i],
                    direction: direction,
                    $parent: this,
                    depth: this.depth
                }));
                if (i < this.option.options.length - 1) {
                    vChildren.push(span({ class: 'divider' }));
                }
            }
        }
        this.render(vChildren);
    }
};
__decorate([
    ReactiveProperty({ type: MenuOption })
], IoMenuOptions.prototype, "option", void 0);
__decorate([
    ReactiveProperty({ value: false, reflect: true })
], IoMenuOptions.prototype, "expanded", void 0);
__decorate([
    ReactiveProperty({ value: false, reflect: true })
], IoMenuOptions.prototype, "horizontal", void 0);
__decorate([
    ReactiveProperty(false)
], IoMenuOptions.prototype, "searchable", void 0);
__decorate([
    ReactiveProperty('')
], IoMenuOptions.prototype, "search", void 0);
__decorate([
    ReactiveProperty({ value: 'none', reflect: true })
], IoMenuOptions.prototype, "direction", void 0);
__decorate([
    ReactiveProperty(100)
], IoMenuOptions.prototype, "depth", void 0);
__decorate([
    ReactiveProperty({ value: '', reflect: true })
], IoMenuOptions.prototype, "overflow", void 0);
__decorate([
    ReactiveProperty(null)
], IoMenuOptions.prototype, "widget", void 0);
__decorate([
    Property()
], IoMenuOptions.prototype, "$parent", void 0);
__decorate([
    Property('listbox')
], IoMenuOptions.prototype, "role", void 0);
IoMenuOptions = __decorate([
    Register
], IoMenuOptions);
export { IoMenuOptions };
export const ioMenuOptions = function (arg0) {
    return IoMenuOptions.vConstructor(arg0);
};
//# sourceMappingURL=IoMenuOptions.js.map