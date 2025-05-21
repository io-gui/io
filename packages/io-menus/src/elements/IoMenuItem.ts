import { Register, ReactiveProperty, Property, IoOverlaySingleton as Overlay, span, VDOMElement, WithBinding, NudgeDirection } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { IoMenuOptions } from './IoMenuOptions.js';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { IoMenuElementType, getMenuRoot, getMenuAncestors, getMenuDescendants, getMenuSiblings, isPointerAboveIoMenuItem } from '../utils/MenuHierarchy.js';

const MenuElementTags = ['io-menu-item', 'io-menu-hamburger', 'io-option-menu', 'io-string'];

const MenuElementTagsSelector = MenuElementTags.join(', ');

export type IoMenuItemProps = IoFieldProps & {
  item?: MenuItem,
  expanded?: WithBinding<boolean>,
  direction?: 'left' | 'right' | 'up' | 'down',
  depth?: number,
};

let hovered: IoMenuElementType | undefined;
let prevHovered: IoMenuElementType | undefined;

/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoMenuItem extends IoField {
  static vConstructor: (arg0?: IoMenuItemProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        user-select: none;
      }
      :host[hidden] {
        display: none;
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

  @ReactiveProperty({type: MenuItem})
  declare item: MenuItem;

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean;

  @ReactiveProperty({value: 'right', reflect: true})
  declare direction: NudgeDirection;

  @ReactiveProperty({value: 1000, reflect: true})
  declare depth: number;

  @Property('false')
  declare contentEditable: boolean;

  declare $options?: IoMenuOptions;

  static get Listeners(): any {
    return {
      'click': 'preventDefault',
      'focus': 'onFocus',
      'blur': 'onBlur',
    };
  }

  constructor(args: IoMenuItemProps = {}) {
    super(args);
    this.collapse = this.collapse.bind(this);
    this.collapseRoot = this.collapseRoot.bind(this);
  }

  preventDefault(event: Event) {
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
    if (this.$options) Overlay.appendChild(this.$options as unknown as HTMLElement);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    Overlay.removeEventListener('pointermove', this._onOverlayPointermove);
    Overlay.removeEventListener('pointerup', this._onOverlayPointerup);
    if (this.$options && this.$options.inlayer) Overlay.removeChild(this.$options as unknown as HTMLElement);
  }
  _onOverlayPointermove(event: PointerEvent) {
    if (!this.inlayer && this.expanded) this.onPointermove(event);
  }
  _onOverlayPointerup(event: PointerEvent) {
    if (!this.inlayer && this.expanded) this.onPointerupAction(event);
  }
  _onClick() {
    const item = this.item;
    if (this.hasmore) {
      if (!this.expanded) this.expanded = true;
    } else if (item.mode === 'toggle') {
      item.selected = !item.selected;
    } else {
      if (item.action) {
        item.action.apply(null, [item.value]);
      }
      if (item.mode === 'select') {
        if (item.hasmore && item.options && this.depth <= 0) {
          item.options.selectDefault();
        } else {
          item.selected = true;
        }
      } else if (item.mode === 'scroll') {
        item.selected = true;
      } else if (item.mode === 'link') {
        window.open(item.value, '_blank');
      }
      this.dispatchEvent('item-clicked', item, true);
      this.debounce(this.collapse);
    }
  }
  _onItemClicked(event: PointerEvent) {
    const item = event.composedPath()[0];
    if (item !== (this as any)) {
      event.stopImmediatePropagation();
      this.dispatchEvent('item-clicked', event.detail, true);
    }
    if (this.expanded) this.debounce(this.collapse);
  }
  onPointerdown(event: PointerEvent) {
    event.stopPropagation();
    event.preventDefault(); // Prevents focus
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this.onPointermove);
    this.addEventListener('pointerup', this.onPointerup);
    this.onPointerdownAction(event);
  }
  onPointerdownAction(event: PointerEvent) {
    // TODO: why is this needed?
    if (this.expanded || event.pointerType === 'mouse' || this.inlayer) {
      this.focus();
    }

    // hovered = this;
    // hoveredParent = this.parentElement;
    // TODO: Safari temp fix for event.movement = 0
    this._x = event.clientX;
    this._y = event.clientY;
  }
  onPointermove(event: PointerEvent) {
    event.stopPropagation();
    this.onPointermoveAction(event);
  }
  onPointermoveAction(event: PointerEvent) {
    // TODO: why is this needed?
    if (!this.expanded && event.pointerType === 'touch' && !this.inlayer) return;

    const clipped = !!this.$parent && !!this.$parent.style.height;

    if (event.pointerType === 'touch' && clipped) return;

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
      } else if (h ? v < -0.25 : v > 0.25) {
        this._expandHovered();
      } else {
        this._timeoutOpen = setTimeout(() => {
          this._expandHovered();
        }, 100);
      }
      prevHovered = hovered;
    }
  }
  onPointerup(event: PointerEvent) {
    event.stopPropagation();
    this.removeEventListener('pointermove', this.onPointermove);
    this.removeEventListener('pointerup', this.onPointerup);
    this.onPointerupAction(event);
  }
  onPointerupAction(event: PointerEvent, skipCollapse = false) {
    const item = this._gethovered(event);
    if (item) {
      item.focus();
      item._onClick(event);
    } else if (!skipCollapse) {
      this.debounce(this.collapseRoot);
    }
    hovered = undefined;
    prevHovered = undefined;
  }
  onFocus(event: FocusEvent) {
    super.onFocus(event);
    if (this.hasmore && !this.expanded) this.expanded = true;
  }
  onBlur(event: FocusEvent) {
    super.onBlur(event);
    this.debounce(this._onBlurDebounced);
  }
  _onBlurDebounced() {
    const descendants = getMenuDescendants(this);
    const siblings = getMenuSiblings(this);
    const ancestors = getMenuAncestors(this);
    const descendantIsFocused = descendants.some(descendant => descendant === document.activeElement as unknown as IoMenuElementType);
    const siblingIsFocused = siblings.some(sibling => sibling === document.activeElement as unknown as IoMenuElementType);
    const ancestorIsFocused = ancestors.some(ancestor => ancestor === document.activeElement as unknown as IoMenuElementType);

    if (descendantIsFocused || siblingIsFocused) return;
    if (ancestorIsFocused) {
      this.debounce(this.collapse);
    } else {
      this.debounce(this.collapseRoot);
    }
  }
  _gethovered(event: PointerEvent) {
    const items = getMenuDescendants(getMenuRoot(this));
    const hovered: IoMenuElementType[] = [];
    for (let i = items.length; i--;) {
      if (isPointerAboveIoMenuItem(event, items[i])) {
        hovered.push(items[i]);
      }
    }
    if (hovered.length) {
      hovered.sort((a: IoMenuElementType, b: IoMenuElementType) => {
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
          if (items[i] !== hovered) items[i].expanded = false;
        }
      }
    }
  }
  onKeydown(event: KeyboardEvent) {
    let command = '';
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.hasmore) {
        command = 'in';
      } else {
        event.preventDefault();
        this._onClick();
        return;
      }
    } else if (event.key === 'Escape') {
      if (this.expanded) {
        command = 'collapse';
      } else {
        command = 'out';
      }
    }

    if (this.hasmore) {
      if (this.direction === 'left' && event.key === 'ArrowLeft') {
        command = 'in';
      } else if (this.direction === 'right' && event.key === 'ArrowRight') {
        command = 'in';
      } else if (this.direction === 'up' && event.key === 'ArrowUp') {
        command = 'in';
      } else if (this.direction === 'down' && event.key === 'ArrowDown') {
        command = 'in';
      }
    }

    if (this.inlayer && event.key === 'Tab') {
      event.preventDefault();
      if (this.direction === 'left' || this.direction === 'right') {
        this.dispatchEvent('io-focus-to', {source: this, direction: 'down'}, true);
      } else {
        this.dispatchEvent('io-focus-to', {source: this, direction: 'right'}, true);
      }
    }

    if (command) {
      event.preventDefault();
      switch (command) {
        case 'collapse': {
          this.expanded = false;
          break;
        }
        case 'in':
          this.expanded = true;
          if (this.$options && this.$options.children.length) this.$options.children[0].focus();
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
    } else {
      super.onKeydown(event);
    }
  }
  collapse() {
    this.expanded = false;
  }
  collapseRoot() {
    const root = getMenuRoot(this);
    root.collapse();
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
        if (this.$options.parentElement !== Overlay) Overlay.appendChild(this.$options as unknown as HTMLElement);
        this.$options.addEventListener('item-clicked', this._onItemClicked);
      } else {
        this.$options.removeEventListener('item-clicked', this._onItemClicked);
      }
      const $descendants = getMenuDescendants(this.$options);
      for (let i = $descendants.length; i--;) $descendants[i].expanded = false;
    }
  }
  itemChanged() {
    this.setProperties({
      selected: this.item.bind('selected'),
      disabled: this.item.bind('disabled'),
    });
  }
  itemMutated() {
    this.changed();
  }
  changed() {
    if (this.$options !== undefined && this.item.options) {
      this.$options.options = this.item.options;
    }
    const icon = this.icon || this.item.icon;

    this.setAttribute('hidden', this.item.hidden);

    this.template([
      this.hasmore && this.direction === 'left' ? ioIcon({value: 'io:triangle_left', class: 'hasmore'}) : null,
      this.hasmore && this.direction === 'up' ? ioIcon({value: 'io:triangle_up', class: 'hasmore'}) : null,
      icon ? ioIcon({value: icon}) : null,
      this.item.label ? span({class: 'label'}, this.item.label) : null,
      this.item.hint ? span({class: 'hint'}, this.item.hint) : null,
      this.hasmore && this.direction === 'right' ? ioIcon({value: 'io:triangle_right', class: 'hasmore'}) : null,
      this.hasmore && this.direction === 'down' ? ioIcon({value: 'io:triangle_down', class: 'hasmore'}) : null,
    ]);
  }
}
export const ioMenuItem = IoMenuItem.vConstructor;




