import {RegisterIoElement} from '../../iogui.js';
import {Item} from '../../models/item.js';
import {IoItem} from '../core/item.js';
import {IoLayerSingleton as Layer} from '../core/layer.js';
import {IoMenuOptions} from './menu-options.js';

/*
 * Extends `IoItem`. Implements `IoMenuOptions` and `IoLayerSingleton`.
 *
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 *
 * <io-element-demo element="io-menu-item" properties='{
 *   "value": "hello world",
 *   "option": {"label": "options", "options": ["one", "two", "three"]},
 *   "expanded": false,
 *   "direction": "right",
 *   "selectable": true
 * }' config='{
 *   "direction": ["io-option-menu", {"options": ["top", "right", "bottom", "left"]}], "type:object": ["io-object"]
 * }'></io-element-demo>
 **/

// TODO: fix and improve keyboard navigation in all cases.

export class IoMenuItem extends IoItem {
  static get Style() {
    return /* css */`
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: row;
      border-radius: 0;
    }
    :host > * {
      pointer-events: none;
    }
    :host > :empty {
      display: none;
    }
    :host > :not(:empty) {
      padding: 0 var(--io-spacing);
    }
    :host > io-icon {
      width: var(--io-line-height);
      height: var(--io-line-height);
      margin-right: var(--io-spacing);
    }
    :host > .io-menu-label {
      flex: 1 1 auto;
      text-overflow: ellipsis;
    }
    :host > .io-menu-hint {
      opacity: 0.25;
    }
    :host[hasmore][direction="up"]:after {
      content: '\\25B4';
      margin-left: 0.5em;
    }
    :host[hasmore][direction="right"]:after {
      content: '\\25B8';
      margin-left: 0.5em;
    }
    :host[hasmore][direction="bottom"]:after {
      content: '\\25BE';
      margin-left: 0.5em;
    }
    :host[hasmore][direction="left"]:before {
      content: '\\25C2';
      margin-right: 0.5em;
    }
    :host[selected][direction="top"],
    :host[selected][direction="bottom"] {
      border-bottom-color: var(--io-color-link);
    }
    :host[selected][direction="right"],
    :host[selected][direction="left"] {
      border-left-color: var(--io-color-link);
    }
    `;
  }
  static get Properties(): any {
    return {
      option: {
        type: Item,
      },
      expanded: {
        value: false,
        reflect: 1,
      },
      direction: {
        value: 'bottom',
        reflect: 1,
      },
      icon: String,
      $parent: null,
      $options: null,
      depth: Infinity,
      lazy: true,
    };
  }
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
    return this.option.hasmore && this.depth > 0;
  }
  get inlayer() {
    return this.$parent && this.$parent.inlayer;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.$options) Layer.appendChild(this.$options);
    if (!this.inlayer) Layer.addEventListener('pointermove', this._onLayerPointermove);
    if (!this.inlayer) Layer.addEventListener('pointerup', this._onLayerPointerup);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options && this.$options.inlayer) Layer.removeChild(this.$options);
    Layer.removeEventListener('pointermove', this._onLayerPointermove);
    Layer.removeEventListener('pointerup', this._onLayerPointerup);
  }
  _onClick() {
    const option = this.option;
    if (this.hasmore) {
      if (!this.expanded) this.expanded = true;
    } else if (option.select === 'toggle') {
      option.selected = !option.selected;
    } else {
      if (option.action) {
        option.action.apply(null, [option.value]);
      }
      if (option.select === 'pick') {
        if (option.hasmore && this.depth <= 0) {
          option.options.selectDefault();
        } else {
          option.selected = true;
        }
      }
      this.dispatchEvent('item-clicked', option, true);
      this.requestAnimationFrameOnce(this._onCollapse);
    }
  }
  _onItemClicked(event: PointerEvent) {
    const item = event.composedPath()[0];
    if (item !== (this as any)) {
      event.stopImmediatePropagation();
      this.dispatchEvent('item-clicked', event.detail, true);
    }
    if (this.expanded) this.requestAnimationFrameOnce(this._onCollapse);
  }
  _onPointerdown(event: PointerEvent) {
    event.stopPropagation();
    event.preventDefault(); // Prevents focus
    this.setPointerCapture(event.pointerId);
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    if (this.expanded || event.pointerType === 'mouse' || this.inlayer) {
      this.focus();
      if (this.option.options) this.expanded = true;
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
  _gethovered(event: PointerEvent) {
    const items = getElementDescendants(getRootElement(this as unknown as IoMenuItem));
    for (let i = items.length; i--;) {
      if (isPointerAboveItem(event, items[i])) return items[i];
    }
  }
  _expandHovered() {
    if (hovered) {
      hovered.focus();
      if (hovered.hasmore) {
        if (hovered.$options) {
          const descendants = getElementDescendants(hovered.$options);
          for (let i = descendants.length; i--;) {
            descendants[i].expanded = false;
          }
        }
        hovered.expanded = true;
      }
    }
  }
  _onLayerPointermove(event: PointerEvent) {
    if (this.expanded) this._onPointermove(event);
  }
  _onLayerPointerup(event: PointerEvent) {
    if (this.expanded) this._onPointerup(event);
  }
  _onPointerup(event: PointerEvent) {
    event.stopPropagation();
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    const item = this._gethovered(event);

    if (item) {
      item.focus();
      item._onClick(event);
    } else {
      this.requestAnimationFrameOnce(this._onCollapseRoot);
    }
  }
  _onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this._onClick();
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.requestAnimationFrameOnce(this._onCollapseRoot);
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
    if (command && (this.inlayer || this.expanded)) {
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
    getRootElement(this as unknown as IoMenuItem).expanded = false;
  }
  expandedChanged() {
    if (!this.$options) this.$options = new IoMenuOptions();
    if (this.expanded && this.depth > 0) {

      if (this.$options.parentElement !== Layer) Layer.appendChild(this.$options);

      const $allitems = getElementDescendants(getRootElement(this));
      const $ancestoritems = getElementAncestors(this);
      for (let i = $allitems.length; i--;) {
        if ($ancestoritems.indexOf($allitems[i]) === -1) {
          $allitems[i].expanded = false;
        }
      }

      const $descendants = getElementDescendants(this.$options);
      for (let i = $descendants.length; i--;) {
        $descendants[i].expanded = false;
      }

      this.$options.addEventListener('item-clicked', this._onItemClicked);
    } else {
      const $descendants = getElementDescendants(this);
      for (let i = $descendants.length; i--;) {
        $descendants[i].expanded = false;
      }

      this.$options.removeEventListener('item-clicked', this._onItemClicked);
    }
  }
  optionChanged(change: CustomEvent) {
    if ((change as any).oldValue) {
      (change as any).oldValue.removeEventListener('changed', this.onOptionChanged);
    }
    if ((change as any).value) {
      (change as any).value.addEventListener('changed', this.onOptionChanged);
    }
  }
  onOptionChanged() {
    this.changed();
  }
  changed() {
    const option = this.option;
    debug: {
      if (option === undefined) {
        console.warn('menu-item has no option defined!');
      }
    }
    // TODO: reconsider
    if (option === undefined) return;

    const icon = this.icon || option.icon;
    this.setAttribute('selected', option.selected);
    this.setAttribute('hasmore', this.hasmore);
    this.template([
      icon ? ['io-icon', {icon: icon}] : null,
      ['span', {class: 'io-menu-label'}, option.label],
      ['span', {class: 'io-menu-hint'}, option.hint],
    ]);
    if (this.$options) {
      this.$options.setProperties({
        $parent: this,
        depth: this.depth - 1,
        expanded: this.bind('expanded'),
        options: option.options,
        position: this.direction,
      });
    }
  }
}

RegisterIoElement(IoMenuItem);

export function getElementDescendants(element: IoMenuItem): any {
  const descendants = [];
  let items = [];
  // TODO: unhack
  if ('io-menu-item, io-option-menu'.search(element.localName) !== -1) {
    descendants.push(element);
    if (element.$options) {
      items = element.$options.querySelectorAll('io-menu-item, io-option-menu');
    }
  } else if (element.localName === 'io-context-menu') {
    if (element.$options) {
      items = element.$options.querySelectorAll('io-menu-item, io-option-menu');
    }
  } else {
    items = element.querySelectorAll('io-menu-item, io-option-menu');
  }
  for (let i = items.length; i--;) {
    descendants.push(items[i]);
    if (items[i].expanded) descendants.push(...getElementDescendants(items[i]));
  }
  return descendants;
}

function getElementAncestors(element: IoMenuItem) {
  let item = element;
  const ancestors = [element];
  while (item && item.$parent) {
    item = item.$parent;
    if (item) ancestors.push(item);
  }
  return ancestors;
}

function getRootElement(element: IoMenuItem) {
  let root = element;
  while (root && root.$parent) {
    root = root.$parent;
  }
  return root;
}

function isPointerAboveItem(event: PointerEvent, element: IoMenuItem) {
  const r = element.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  if (['io-menu-item', 'io-option-menu'].indexOf(element.localName) !== -1) {
    if (!element.inlayer || element.parentElement.expanded) {
      const hovered = (
        r.top <= y &&
        r.bottom >= y &&
        r.left <= x &&
        r.right >= x
        );
      return hovered;
    }
  }
  return null;
}

let hovered: any;
let hoveredParent: any;
