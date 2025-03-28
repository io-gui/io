var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, Property, IoStorage as $, genObjectStorageID } from 'io-gui';
import { MenuItem } from './models/menu-item.js';
import { MenuOptions } from './models/menu-options.js';
export function addMenuOptions(options, depth, d = 0) {
    const elements = [];
    if (d <= depth)
        for (let i = 0; i < options.length; i++) {
            const item = options[i];
            if (item.options?.length) {
                const collapsableState = $({ value: item.selected, storage: 'local', key: genObjectStorageID(item) });
                if (item.selected === true)
                    collapsableState.value = true;
                elements.push(['io-collapsable', {
                        label: item.label,
                        icon: item.icon,
                        expanded: collapsableState,
                        elements: [...addMenuOptions(item.options, depth, d + 1)]
                    }]);
            }
            else {
                elements.push(['io-menu-item', {
                        item: item,
                        depth: d
                    }]);
            }
        }
    return elements;
}
function matchItem(item, search) {
    if (item.value !== undefined && String(item.value).toLowerCase().indexOf(search) !== -1)
        return true;
    if (item.label && item.label.toLowerCase().indexOf(search) !== -1)
        return true;
    if (item.hint && item.hint.toLowerCase().indexOf(search) !== -1)
        return true;
    return false;
}
export function filterOptions(options, search, depth = 5, elements = [], d = 0) {
    search = search.toLowerCase();
    if (d <= depth)
        for (let i = 0; i < options.length; i++) {
            if (matchItem(options[i], search)) {
                elements.push(['io-menu-item', {
                        item: options[i],
                        depth: 0
                    }]);
            }
            if (options[i].options) {
                filterOptions(options[i].options, search, depth, elements, d + 1);
            }
        }
}
let IoMenuTree = class IoMenuTree extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: column;
      flex-wrap: nowrap;
      align-self: stretch;
      align-items: stretch;
      justify-self: stretch;
      border-radius: var(--io_borderRadius);
      border: var(--io_border);
      border-color: var(--io_borderColorOutset);
      color: var(--io_colorField);
      background-color: var(--io_bgColorDimmed);
      padding: var(--io_spacing) 0;
      align-self: flex-start;
      user-select: none;
      transition: opacity 0.25s;
      overflow: auto;
    }

    :host io-collapsable {
      flex: 0 0 auto;
      border-color: transparent;
      border: 0;
      overflow: visible;
    }
    :host io-collapsable > div.io-collapsable-content {
      background-color: transparent;
      flex: 0 0 auto;
      border-radius: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      background: var(--io_bgColorDimmed);
    }
    
    :host io-menu-item:first-of-type {
      margin-top: var(--io_borderWidth);
    }
    :host io-menu-item {
      background-color: var(--io_bgColorDimmed);
      flex: 0 0 auto;
      align-self: stretch;
      border-radius: 0;
      margin-left: var(--io_borderWidth);
      margin-right: var(--io_borderWidth);
    }
    :host io-menu-item[depth="1"] {
      padding-left: calc(var(--io_lineHeight) * 1);
    }
    :host io-menu-item[depth="2"] {
      padding-left: calc(var(--io_lineHeight) * 2);
    }
    :host io-menu-item[depth="3"] {
      padding-left: calc(var(--io_lineHeight) * 3);
    }
    :host io-menu-item[depth="4"] {
      padding-left: calc(var(--io_lineHeight) * 4);
    }
    :host io-menu-item[depth="5"] {
      padding-left: calc(var(--io_lineHeight) * 5);
    }
    :host io-menu-item[depth="6"] {
      padding-left: calc(var(--io_lineHeight) * 6);
    }
    /* Item spacing */
    :host io-menu-item {
      margin-bottom: var(--io_borderWidth);
    }
    :host io-menu-item:first-of-type {
      /* margin-top: var(--io_spacing); */
    }

    /* Item dividers */
    :host io-collapsable > io-boolean {
      margin: 0;
      margin-left: var(--io_borderWidth);
      margin-right: var(--io_borderWidth);
      z-index: 1;
      overflow: visible;
    }

    /* Search field */
    :host > .search {
      border-radius: 0;
      flex: 0 0 auto;
    }
    `;
    }
    static get Listeners() {
        return {
            'item-clicked': '_onItemClicked',
        };
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
    // TODO: fix UX. This shouldselect search field on collapse by click.
    _onCollapse() {
        const focusSearch = this.searchable && this.search;
        this.search = '';
        if (focusSearch)
            this.$.search.focus();
    }
    changed() {
        const elements = [...this.slotted];
        // TODO: fix depth.
        if (this.searchable) {
            elements.push(['io-string', {
                    $: 'search',
                    role: 'search',
                    class: 'search',
                    value: this.bind('search'),
                    placeholder: 'Search',
                    live: true
                }]);
        }
        if (this.search) {
            const len = elements.length;
            filterOptions(this.options, this.search, this.depth, elements);
            if (len === elements.length) {
                elements.push(['io-menu-item', { item: new MenuItem({ label: 'No matches', mode: 'none' }) }]);
            }
        }
        else {
            elements.push(...addMenuOptions(this.options, this.depth));
        }
        this.template(elements);
    }
};
__decorate([
    Property({ type: MenuOptions, reflect: true })
], IoMenuTree.prototype, "options", void 0);
__decorate([
    Property(false)
], IoMenuTree.prototype, "searchable", void 0);
__decorate([
    Property('')
], IoMenuTree.prototype, "search", void 0);
__decorate([
    Property(Infinity)
], IoMenuTree.prototype, "depth", void 0);
__decorate([
    Property({ type: Array })
], IoMenuTree.prototype, "slotted", void 0);
__decorate([
    Property('listbox')
], IoMenuTree.prototype, "role", void 0);
__decorate([
    Property(undefined)
], IoMenuTree.prototype, "$parent", void 0);
IoMenuTree = __decorate([
    Register
], IoMenuTree);
export { IoMenuTree };
//# sourceMappingURL=io-menu-tree.js.map