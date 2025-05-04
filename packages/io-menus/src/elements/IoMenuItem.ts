import { Register, Property, Default, IoOverlaySingleton as Overlay, span, VDOMElement, PropsWithBinding, NudgeDirection } from 'io-gui';
import { MenuItem } from '../nodes/MenuItem.js';
import { IoMenuOptions } from './IoMenuOptions.js';
import { IoInputBase, IoInputBaseProps } from 'io-inputs';
import { ioIcon } from 'io-icons';

const MenuElementTags = ['io-menu-item', 'io-menu-hamburger', 'io-option-menu'];
const MenuElementTagsSelector = MenuElementTags.join(', ');

export type IoMenuItemProps = IoInputBaseProps & PropsWithBinding<{
  item?: MenuItem;
  expanded?: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  depth?: number;
}>;

/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoMenuItem extends IoInputBase {
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

  @Property({type: MenuItem})
  declare item: MenuItem;

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Property({value: 'right', reflect: true})
  declare direction: NudgeDirection;

  @Property({value: 1000, reflect: true})
  declare depth: number;

  @Default('false')
  declare contentEditable: boolean;

  declare $options?: IoMenuOptions;

  static get Listeners(): any {
    return {
      'click': 'preventDefault',
    };
  }

  constructor(args: IoMenuItemProps = {}) { super(args); }

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
      this.throttle(this._onCollapse);
    }
  }
  _onItemClicked(event: PointerEvent) {
    const item = event.composedPath()[0];
    if (item !== (this as any)) {
      event.stopImmediatePropagation();
      this.dispatchEvent('item-clicked', event.detail, true);
    }
    if (this.expanded) this.throttle(this._onCollapse);
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
      if (this.item.options) this.expanded = true;
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
      this.throttle(this._onCollapseRoot);
    }
    hovered = undefined;
    prevHovered = undefined;
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
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._onClick();
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.throttle(this._onCollapseRoot);
      return;
    }

    let command = '';
    if (this.direction === 'left' || this.direction === 'right') {
      if (event.key === 'ArrowUp') command = 'prev';
      if (event.key === 'ArrowRight') command = 'in';
      if (event.key === 'ArrowDown') command = 'next';
      if (event.key === 'ArrowLeft') command = 'out';
    } else {
      if (event.key === 'ArrowUp') command = 'out';
      if (event.key === 'ArrowRight') command = 'next';
      if (event.key === 'ArrowDown') command = 'in';
      if (event.key === 'ArrowLeft') command = 'prev';
    }
    if (this.inlayer && event.key === 'Tab') command = 'next';

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
            if (prev.hasmore) prev.expanded = true;
            prev.focus();
          }
          break;
        }
        case 'next': {
          const next = siblings[(index + 1) % (siblings.length)];
          this.expanded = false;
          if (next) {
            if (next.hasmore) next.expanded = true;
            next.focus();
          }
          break;
        }
        case 'in':
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
  _onCollapse() {
    this.expanded = false;
  }
  _onCollapseRoot() {
    getMenuRoot(this as unknown as IoMenuItem).expanded = false;
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

type IoMenuElementType = IoMenuItem | IoMenuOptions;

export function getMenuDescendants(element: IoMenuElementType): IoMenuElementType[] {
  const descendants = [];
  if (element.$options) {
    if (element.expanded) {
      descendants.push(element.$options);
      const items = element.$options.querySelectorAll(MenuElementTagsSelector);
      for (let i = items.length; i--;) {
        descendants.push(items[i]);
        if (items[i].expanded) descendants.push(...getMenuDescendants(items[i]));
      }
    }
  } else {
    const items = element.querySelectorAll(MenuElementTagsSelector);
    for (let i = items.length; i--;) {
      descendants.push(items[i]);
      if (items[i].expanded) descendants.push(...getMenuDescendants(items[i]));
    }
  }
  return descendants;
}

export function getMenuAncestors(element: IoMenuElementType) {
  const ancestors = [];
  let item = element;
  while (item && item.$parent) {
    item = item.$parent;
    if (item) ancestors.push(item);
  }
  return ancestors;
}

export function getMenuRoot(element: IoMenuElementType) {
  let first = element;
  while (first && first.$parent) {
    first = first.$parent;
  }
  return first;
}

function isPointerAboveIoMenuItem(event: PointerEvent, element: IoMenuElementType) {
  if (MenuElementTags.indexOf(element.localName) !== -1) {
    // TODO: hidden in no longer a property.
    if (!element.disabled && !element.hidden) {
      if (!element.inlayer || (element.parentElement.expanded && Overlay.expanded)) {
        const bw = 1; // TODO: temp hack to prevent picking items below through margin(1px) gaps.
        const r = element.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        const hovered = (r.top <= y+bw && r.bottom >= y-bw && r.left <= x+bw && r.right >= x-bw );
        return hovered;
      }
    }
  }
  return null;
}

let hovered: IoMenuElementType | undefined;
let prevHovered: IoMenuElementType | undefined;
