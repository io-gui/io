import { Register, IoElement, ReactiveProperty, VDOMElement, IoOverlaySingleton as Overlay, NudgeDirection, IoElementProps, WithBinding, Property, nudge, ListenerDefinition } from 'io-gui';
import { ioString } from 'io-inputs';
import { MenuItem } from '../nodes/MenuItem.js';
import { MenuOptions } from '../nodes/MenuOptions.js';
import { ioMenuItem, IoMenuItem } from './IoMenuItem.js';
import { ioMenuHamburger } from './IoMenuHamburger.js';
import { IoContextMenu } from './IoContextMenu.js';
import { getMenuDescendants, getMenuSiblings } from '../utils/MenuDOMUtils.js';
import { searchMenuOptions } from '../utils/MenuNodeUtils.js';

// const rects = new WeakMap();

// TODO: improve focusto nav and in-layer navigation.

export type IoMenuOptionsProps = IoElementProps & {
  options?: WithBinding<MenuOptions>,
  expanded?: WithBinding<boolean>,
  horizontal?: boolean,
  searchable?: boolean,
  search?: WithBinding<string>,
  direction?: NudgeDirection,
  depth?: number,
  noPartialCollapse?: boolean,
  widget?: VDOMElement | null,
  $parent?: IoMenuItem | IoContextMenu,
};

/**
 * It generates a list of `IoMenuItem` elements from `options` property. If `horizontal` property is set, menu items are displayed in horizontal direction.
 **/
@Register
export class IoMenuOptions extends IoElement {
  static vConstructor: (arg0?: IoMenuOptionsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      border: var(--io_border);
      border-radius: calc(var(--io_borderRadius) + var(--io_spacing2));
      border-color: var(--io_borderColorOutset);
      background-color: var(--io_bgColorLight);
      padding: calc(var(--io_spacing) + var(--io_borderWidth));
      user-select: none;
      transition: opacity 0.3s ease-in-out;
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

  @ReactiveProperty({type: MenuOptions})
  declare options: MenuOptions;

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean;

  @ReactiveProperty({value: false, reflect: true})
  declare horizontal: boolean;

  @ReactiveProperty(false)
  declare searchable: boolean;

  @ReactiveProperty('')
  declare search: string;

  @ReactiveProperty({value: 'none', reflect: true})
  declare direction: NudgeDirection;

  @ReactiveProperty(100)
  declare depth: number;

  @ReactiveProperty(false)
  declare noPartialCollapse: boolean;

  @ReactiveProperty({value: '', reflect: true})
  declare overflow: string;

  @ReactiveProperty(null)
  declare widget: VDOMElement | null;

  @Property()
  declare $parent?: IoMenuItem;

  @Property('listbox')
  declare role: string;

  @Property(Array)
  declare private _overflownItems: MenuItem[];

  static get Listeners() {
    return {
      'touchstart': ['stopPropagation', {passive: false}] as ListenerDefinition, // TODO: why?
      'io-focus-to': 'onIoFocusTo',
    };
  }
  get inoverlay() {
    return Overlay.contains(this.parentElement);
  }
  constructor(args: IoMenuOptionsProps = {}) { super(args); }
  // init() {
  //   this.setOverflow = this.setOverflow.bind(this);
  // }
  // ready() {
  //   this.debounce(this.setOverflow);
  // }
  stopPropagation(event: TouchEvent) {
    event.stopPropagation();
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.inoverlay) {
      this.setAttribute('inoverlay', 'true');
    }
  }
  onIoFocusTo(event: CustomEvent) {
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
      if (cmd === 'ArrowRight' && inoverlay) cmdOverride = 'Next';
      if (cmd === 'ArrowLeft' && inoverlay) cmdOverride = 'Prev';
      if (cmd === 'ArrowUp' && parentIsAbove) cmdOverride = 'Out';
      if (cmd === 'ArrowDown' && parentIsBelow) cmdOverride = 'Out';
    } else {
      if (cmd === 'ArrowDown' && inoverlay) cmdOverride = 'Next';
      if (cmd === 'ArrowUp' && inoverlay) cmdOverride = 'Prev';
      if (cmd === 'ArrowLeft' && parentIsLeft) cmdOverride = 'Out';
      if (cmd === 'ArrowRight' && parentIsRight) cmdOverride = 'Out';
    }
    if (cmd === 'Tab' && inoverlay) cmdOverride = 'Next';

    if (cmdOverride) {
      if (cmdOverride === 'Next') {
        siblings[(index + 1) % siblings.length].focus();
      } else if (cmdOverride === 'Prev') {
        siblings[(index - 1 + siblings.length) % siblings.length].focus();
      } else if (cmdOverride === 'Out') {
        if (this.$parent) this.$parent.focus();
      }
      event.stopPropagation();
    }
  }
  // onResized() {
  //   this.debounce(this.setOverflow);
  // }
  // setOverflow() {
  //   if (this._disposed) return;
  //   const items = Array.from(this.querySelectorAll('.item')) as IoMenuItem[];
  //   this._overflownItems.length = 0;
  //   if (this.horizontal) {
  //     const hamburger = this.querySelector('io-menu-hamburger');
  //     const hamburgetWidth = hamburger?.getBoundingClientRect().width || 0;
  //     const end = this.getBoundingClientRect().right - (ThemeSingleton.borderWidth + ThemeSingleton.spacing);
  //     let last = Infinity;
  //     let hasOwerflown = false;

  //     for (let i = items.length; i--;) {
  //       const r = items[i].getBoundingClientRect();
  //       const rect = rects.get(items[i].item) || {right: 0, width: 0};
  //       if (r.right !== 0 && r.width !== 0)  {
  //         rect.right = r.right;
  //         rect.width = r.width;
  //         rects.set(items[i].item, rect);
  //       }

  //       last = Math.min(last, rect.right);
  //       if (this.noPartialCollapse && hasOwerflown) {
  //         items[i].hidden = true;
  //         this._overflownItems.unshift(items[i].item);
  //       } else if (i === (items.length - 1) && last < end) {
  //         items[i].hidden = false;
  //       } else if (last < (end - hamburgetWidth * 1.5)) {
  //         items[i].hidden = false;
  //       } else {
  //         hasOwerflown = true;
  //         items[i].hidden = true;
  //         this._overflownItems.unshift(items[i].item);
  //       }
  //     }

  //     if (this._overflownItems.length) {
  //       this.overflow = JSON.stringify(this._overflownItems.map((item: MenuItem) => item.label));
  //     } else {
  //       this.overflow = '';
  //     }
  //   } else {
  //     this.overflow = '';
  //   }
  // }
  collapse() {
    const itemWasFocused = this.contains(document.activeElement);
    const searchHadInput = this.searchable && !!this.search;
    getMenuDescendants(this).forEach(descendant => {
      (descendant as any).expanded = false;
    });
    this.expanded = false;
    if (searchHadInput && itemWasFocused && !this.inoverlay) {
      this.search = '';
      this.$.search.focus();
    }
  }
  expandedChanged() {
    if (this.expanded) {
      if (this.inoverlay) {
        this.debounce(this.onExpandInOverlay);
      }
    } else {
      this.style.top = '';
      this.style.height = '';
      this.style.touchAction = '';
      this.scrollTop = 0;
      this.search = '';
    }
  }
  searchChanged() {
    // TODO: focus drifts when filtered item is clicked
    if (this.inoverlay && this.$parent) {
      this.debounce(this.onExpandInOverlay);
    }
    // this.debounce(this.setOverflow);
  }
  // TODO: Move functionality to Overlay
  onExpandInOverlay() {
    if (this.$parent) {
      nudge(this, this.$parent, this.direction, true);
    }
  }
  changed() {
    const vChildren: VDOMElement[] = this.widget ? [this.widget] : [];

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
      const filteredItems = searchMenuOptions(this.options, this.search, this.depth);
      if (filteredItems.length === 0) {
        vChildren.push(ioMenuItem({item: new MenuItem({label: 'No matches', mode: 'none'})}));
      } else {
        for (let i = 0; i < filteredItems.length; i++) {
          vChildren.push(ioMenuItem({item: filteredItems[i], depth: 0}));
          if (i < filteredItems.length - 1) {
            vChildren.push({tag: 'span', props: {class: 'divider'}});
          }
        }
      }
    } else {
      let direction: 'left' | 'right' | 'up' | 'down' = this.horizontal ? 'down' : 'right';
      if (this.horizontal && this.direction === 'up') {
        direction = 'up';
      }
      for (let i = 0; i < this.options.items.length; i++) {
        vChildren.push(ioMenuItem({
          item: this.options.items[i],
          direction: direction,
          $parent: this,
          depth: this.depth
        }));
        if (i < this.options.items.length - 1) {
          vChildren.push({tag: 'span', props: {class: 'divider'}});
        }
      }
    }

    if (this.overflow) {
      vChildren.push(ioMenuHamburger({
        depth: this.depth + 1,
        role: 'navigation',
        direction: 'down',
        item: new MenuItem({
          options: new MenuOptions({
            items: this._overflownItems,
          }),
        })
      }));
    }
    this.render(vChildren);
  }
}
export const ioMenuOptions = IoMenuOptions.vConstructor;