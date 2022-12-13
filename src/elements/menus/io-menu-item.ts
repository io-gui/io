import { RegisterIoElement } from '../../core/element.js';
import { Property } from '../../core/internals/property.js';
import { MenuItem } from './models/menu-item.js';
import { IoField } from '../basic/io-field.js';
import { IoLayerSingleton as Layer } from '../../core/layer.js';
import { IoMenuOptions } from './io-menu-options.js';

/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/

// TODO: fix and improve keyboard navigation in all cases.
@RegisterIoElement
export class IoMenuItem extends IoField {
  static get Style() {
    return /* css */`
    :host {
      background-color: var(--iotBackgroundColorDark);
      user-select: none;
    }
    :host > * {
      pointer-events: none;
    }
    :host > :empty {
      display: none;
    }
    :host > io-icon:not(.hasmore) {
      width: var(--iotLineHeight);
      height: var(--iotLineHeight);
    }
    :host > .label {
      flex: 1 1 auto;
      text-overflow: ellipsis;
      padding: 0 var(--iotSpacing2);
    }
    :host > .hint {
      opacity: 0.25;
      margin: 0 var(--iotSpacing4);
    }
    :host > io-icon.hasmore {
      opacity: 0.5;
      line-height: initial;
    }
    :host[selected][direction="up"],
    :host[selected][direction="down"] {
      border-bottom-color: var(--iotBorderColorSelected);
    }
    :host[selected][direction="right"],
    :host[selected][direction="left"] {
      border-left-color: var(--iotBorderColorSelected);
    }
    `;
  }

  @Property({observe: true, type: MenuItem})
  declare item: MenuItem;

  @Property({value: false, reflect: true})
  declare expanded: boolean;

  @Property({value: 'right', reflect: true})
  declare direction: string;

  @Property({value: 1000, reflect: true})
  declare depth: number;

  @Property(undefined)
  $options?: IoMenuOptions;

  static get Listeners(): any {
    return {
      'click': 'preventDefault',
    };
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
    Layer.addEventListener('pointermove', this._onLayerPointermove);
    Layer.addEventListener('pointerup', this._onLayerPointerup);
    if (this.$options) Layer.appendChild(this.$options as unknown as HTMLElement);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    Layer.removeEventListener('pointermove', this._onLayerPointermove);
    Layer.removeEventListener('pointerup', this._onLayerPointerup);
    if (this.$options && this.$options.inlayer) Layer.removeChild(this.$options as unknown as HTMLElement);
  }
  _onLayerPointermove(event: PointerEvent) {
    if (!this.inlayer && this.expanded) this._onPointermove(event);
  }
  _onLayerPointerup(event: PointerEvent) {
    if (!this.inlayer && this.expanded) this._onPointerupAction(event);
  }
  _onClick() {
    const item = this.item;
    if (this.hasmore) {
      if (!this.expanded) this.expanded = true;
    } else if (item.select === 'toggle') {
      item.selected = !item.selected;
    } else {
      if (item.action) {
        item.action.apply(null, [item.value]);
      }
      if (item.select === 'pick') {
        if (item.hasmore && item.options && this.depth <= 0) {
          item.options.selectDefault();
        } else {
          item.selected = true;
        }
      } else if (item.select === 'link') {
        window.open(item.value, '_blank');
      }
      this.dispatchEvent('item-clicked', item, true);
      this.throttle(this._onCollapse, undefined, true);
    }
  }
  _onItemClicked(event: PointerEvent) {
    const item = event.composedPath()[0];
    if (item !== (this as any)) {
      event.stopImmediatePropagation();
      this.dispatchEvent('item-clicked', event.detail, true);
    }
    if (this.expanded) this.throttle(this._onCollapse, undefined, true);
  }
  _onPointerdown(event: PointerEvent) {
    event.stopPropagation();
    event.preventDefault(); // Prevents focus
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    // TODO: why is this needed?
    if (this.expanded || event.pointerType === 'mouse' || this.inlayer) {
      this.focus();
      if (this.item.options) this.expanded = true;
    }
    // eslint-disable-next-line
    hovered = this;
    hoveredParent = this.parentElement;
    // TODO: Safari temp fix for event.movement = 0
    this._x = event.clientX;
    this._y = event.clientY;
  }
  _onPointermove(event: PointerEvent) {
    event.stopPropagation();
    // TODO: why is this needed?
    if (!this.expanded && event.pointerType === 'touch' && !this.inlayer) return;

    const clipped = !!this.$parent && !!this.$parent.style.height;

    if (event.pointerType === 'touch' && clipped) return;

    // TODO: Safari temp fix for event.movement = 0
    const movementX = event.clientX - this._x;
    const movementY = event.clientY - this._y;
    this._x = event.clientX;
    this._y = event.clientY;

    Layer.x = event.clientX;
    Layer.y = event.clientY;
    clearTimeout(this._timeoutOpen);
    hovered = this._gethovered(event);
    if (hovered) {
      const v = Math.abs(movementY) - Math.abs(movementX);
      const h = hovered.parentElement.horizontal;
      if (hoveredParent !== hovered.parentElement) {
        hoveredParent = hovered.parentElement;
        this._expandHovered();
      } else if (h ? v < -0.5 : v > 0.5) {
        this._expandHovered();
      } else {
        this._timeoutOpen = setTimeout(() => {
          this._expandHovered();
        }, 100);
      }
    }
  }
  _onPointerup(event: PointerEvent) {
    event.stopPropagation();
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    this._onPointerupAction(event);
  }
  _onPointerupAction(event: PointerEvent) {
    const item = this._gethovered(event);
    if (item) {
      item.focus();
      item._onClick(event);
    } else {
      this.throttle(this._onCollapseRoot);
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
        const items = hovered.$parent.querySelectorAll('io-menu-item, io-option-menu');
        for (let i = items.length; i--;) {
          if (items[i] !== hovered) items[i].expanded = false;
        }
      }
    }
  }
  _onKeydown(event: KeyboardEvent) {
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
      super._onKeydown(event);
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
          depth: this.depth - 1,
          options: this.item.options,
          direction: this.direction,
          inlayer: true,
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
        if (this.$options.parentElement !== Layer) Layer.appendChild(this.$options as unknown as HTMLElement);
        this.$options?.addEventListener('item-clicked', this._onItemClicked);
      } else {
        this.$options?.removeEventListener('item-clicked', this._onItemClicked);
      }
      const $descendants = getMenuDescendants(this.$options);
      for (let i = $descendants.length; i--;) $descendants[i].expanded = false;
    }
  }
  changed() {
    if (this.$options !== undefined && this.item.options) {
      this.$options.options = this.item.options;
    }
    const icon = this.icon || this.item.icon;
    this.setAttribute('selected', this.item.selected);
    this.setAttribute('hasmore', this.hasmore);
    this.disabled = this.item.disabled; // TODO: reconsider this
    this.template([
      this.hasmore && this.direction === 'left' ? ['io-icon', {class: 'hasmore', icon: 'icons:triangle_left'}] : null,
      this.hasmore && this.direction === 'up' ? ['io-icon', {class: 'hasmore', icon: 'icons:triangle_up'}] : null,
      // icon ? ['io-icon', {icon: icon}] : null,
      ['io-icon', {icon: icon || ' '}],
      ['span', {class: 'label'}, this.item.label],
      ['span', {class: 'hint'}, this.item.hint],
      this.hasmore && this.direction === 'right' ? ['io-icon', {class: 'hasmore', icon: 'icons:triangle_right'}] : null,
      this.hasmore && this.direction === 'down' ? ['io-icon', {class: 'hasmore', icon: 'icons:triangle_down'}] : null,
    ]);
  }
}

type IoMenuElementType = IoMenuItem | IoMenuOptions;

export function getMenuDescendants(element: IoMenuElementType): IoMenuElementType[] {
  const descendants = [];
  if (element.$options) {
    if (element.expanded) {
      descendants.push(element.$options);
      const items = element.$options.querySelectorAll('io-menu-item, io-option-menu');
      for (let i = items.length; i--;) {
        descendants.push(items[i]);
        if (items[i].expanded) descendants.push(...getMenuDescendants(items[i]));
      }
    }
  } else {
    const items = element.querySelectorAll('io-menu-item, io-option-menu');
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
  let root = element;
  while (root && root.$parent) {
    root = root.$parent;
  }
  return root;
}

function isPointerAboveIoMenuItem(event: PointerEvent, element: IoMenuElementType) {
  if (['io-menu-item', 'io-option-menu'].indexOf(element.localName) !== -1) {
    if (!element.disabled && !element.hidden) {
      if (!element.inlayer || element.parentElement.expanded) {
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
let hoveredParent: IoMenuElementType | undefined;
