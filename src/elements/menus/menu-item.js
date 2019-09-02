import {html} from "../../io.js";
import {IoItem, IoLayerSingleton} from "../../io-core.js";
import {IoMenuOptions} from "./menu-options.js";

// TODO: fix and improve keyboard navigation in all cases.

function getElementDescendants(element) {
  const descendants = [];
  let items;
  // TODO: unhack
  if ('io-menu-item, io-option-menu'.search(element.localName) !== -1) {
    descendants.push(element);
    items = element.$options.querySelectorAll('io-menu-item, io-option-menu');
  } else if (element.localName === 'io-context-menu') {
    items = element.$options.querySelectorAll('io-menu-item, io-option-menu');
  } else {
    items = element.querySelectorAll('io-menu-item, io-option-menu');
  }
  for (let i = items.length; i--;) {
    descendants.push(items[i]);
    if (items[i].expanded) descendants.push(...getElementDescendants(items[i]));
  }
  return descendants;
}

function getElementAncestors(element) {
  let item = element;
  const ancestors = [element];
  while (item && item.$parent) {
    item = item.$parent;
    if (item) ancestors.push(item);
  }
  return ancestors;
}

function getRootElement(element) {
  let root = element;
  while (root && root.$parent) {
    root = root.$parent;
  }
  return root;
}

function isPointerAboveElement(event, element) {
  const r = element.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  return (r.top < y && r.bottom > y && r.left < x && r.right > x);
}

let hoveredItem;
let hoveredParent;

export class IoMenuItem extends IoItem {
  static get Style() {
    return html`<style>
    :host {
      display: flex;
      flex: 0 0 auto;
      flex-direction: row;
      padding: var(--io-spacing);
      border-radius: 0;
      background: none;
      border: var(--io-border-width) solid transparent;
    }
    :host:hover:not([selected]) {
      background-color: inherit;
    }
    :host > * {
      overflow: visible;
      pointer-events: none;
    }
    :host > :not(:empty) {
      padding: 0 var(--io-spacing);
    }
    :host > .io-menu-icon {}
    :host > .io-menu-label {
      flex: 1 1 auto;
      text-overflow: ellipsis;
    }
    :host > .io-menu-hint {
      opacity: 0.25;
    }
    :host[hasmore]:after {
      content: '▸';
    }
    :host[selected][direction="top"],
    :host[selected][direction="bottom"] {
      border-bottom-color: var(--io-color-link);
    }
    :host[selected][direction="right"],
    :host[selected][direction="left"] {
      border-left-color: var(--io-color-link);
    }
    </style>`;
  }
  static get Properties() {
    return {
      option: {
        type: Object,
      },
      expanded: {
        value: false,
        reflect: 1,
      },
      direction: {
        value: 'bottom',
        reflect: 1,
      },
      $parent: HTMLElement,
      $options: HTMLElement,
      selectable: false,
    };
  }
  static get Listeners() {
    return {
      'click': '_preventDefault',
    };
  }
  _preventDefault(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  get _options() {
    if (this.option && this.option.options && this.option.options.length) {
      return this.option.options;
    }
    return undefined;
  }
  get _action() {
    if (this.option && typeof this.option.action === 'function') {
      return this.option.action;
    }
    return undefined;
  }
  get _value() {
    if (this.option && this.option.value !== undefined) {
      return this.option.value;
    } else if (this.option !== undefined && typeof this.option !== 'object') return this.option;
    return undefined;
  }
  get _icon() {
    if (this.option && this.option.icon !== undefined) {
      return this.option.icon;
    }
    return undefined;
  }
  get _label() {
    if (this.label) return this.label;
    if (this.option && this.option.label !== undefined) {
      return this.option.label;
    }
    if (this.option && this.option.value !== undefined) {
      return String(this.option.value);
    }
    else return String(this.option);
  }
  get _hint() {
    if (this.option && this.option.hint !== undefined) {
      return this.option.hint;
    }
    return undefined;
  }
  get _selected() {
    // TODO: make optional selectable on individual options.
    if (!this.selectable) return false;
    if (this.option && (this.option.selected || this.option.value === this.value)) {
      return true;
    } else if (this.value === this.option) {
      return true;
    }
    const options = this._options;
    if (options) return !!this.filterObject(options, (o) => { return o === this.value || o.value === this.value; });
    return false;
  }
  get _inLayer() {
    return this.$parent && this.$parent.parentElement === IoLayerSingleton;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.$options) IoLayerSingleton.appendChild(this.$options);
    if (!this._inLayer) {
      IoLayerSingleton.addEventListener('pointermove', this._onLayerPointermove);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options) IoLayerSingleton.removeChild(this.$options);
    IoLayerSingleton.removeEventListener('pointermove', this._onLayerPointermove);
  }
  _onClick() {
    if (this._value !== undefined || this._action) {
      if (this._value !== undefined) {
        this.set('value', this._value, true);
      }
      if (this._action) {
        this._action.apply(null, [this._value]);
      }
      this.dispatchEvent('item-clicked', {
        value: this._value,
        action: this._action
      }, true);
      getRootElement(this).expanded = false;
    } else if (this._options) {
      this.expanded = true;
    }
  }
  _onPointerdown(event) {
    event.stopPropagation();
    this.addEventListener('pointermove', this._onPointermove);
    this.addEventListener('pointerup', this._onPointerup);
    this.setPointerCapture(event.pointerId);
    if (this.expanded || event.pointerType === 'mouse' || this._inLayer) {
      this.focus();
      if (this._options) this.expanded = true;
    }
    hoveredItem = this;
    hoveredParent = this.parentElement;
  }
  _getHoveredItem(event) {
    const items = getElementDescendants(getRootElement(this));
    for (let i = items.length; i--;) {
      if (isPointerAboveElement(event, items[i])) {
        return items[i];
      }
    }
  }
  _onPointermove(event) {
    if (!this.expanded && event.pointerType === 'touch' && !this._inLayer) {
      return;
    }
    IoLayerSingleton.x = event.clientX;
    IoLayerSingleton.y = event.clientY;
    clearTimeout(this.__timeoutOpen);
    hoveredItem = this._getHoveredItem(event);
    if (hoveredItem) {
      const v = Math.abs(event.movementY) - Math.abs(event.movementX);
      const h = hoveredParent.horizontal;
      if (hoveredParent !== hoveredItem.parentElement) {
        hoveredParent = hoveredItem.parentElement;
        this._expandHovered();
      } else if (h ? v < -0.5 : v > 0.5) {
        this._expandHovered();
      } else {
        this.__timeoutOpen = setTimeout(() => {
          this._expandHovered();
        }, 100);
      }
    }
  }
  _expandHovered() {
    hoveredItem.focus();
    if (hoveredItem._options) {
      hoveredItem.expanded = true;
      const descendants = getElementDescendants(hoveredItem.$options);
      for (let i = descendants.length; i--;) {
        descendants[i].expanded = false;
      }
    }
  }
  _onLayerPointermove(event) {
    if (this.expanded) this._onPointermove(event);
  }
  _onPointerup(event) {
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    let hoveredItem = this._getHoveredItem(event);
    if (!hoveredItem) {
      this.expanded = false;
    } else {
      hoveredItem._onClick(event);
    }
  }
  _onKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.expanded) {
        this.expanded = false;
        return;
      }
      this._onClick(event);
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      getRootElement(this).expanded = false;
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
    if (this._inLayer && event.key === 'Tab') command = 'next';

    const siblings = this.$parent ? [...this.$parent.children] : [];
    const index = siblings.indexOf(this);
    if (command && (this._inLayer || this.expanded)) {
      event.preventDefault();
      switch (command) {
        case 'prev': {
          const prev = siblings[(index + siblings.length - 1) % (siblings.length)];
          this.expanded = false;
          if (prev) {
            if (prev._options) prev.expanded = true;
            prev.focus();
          }
          break;
        }
        case 'next': {
          const next = siblings[(index + 1) % (siblings.length)];
          this.expanded = false;
          if (next) {
            if (next._options) next.expanded = true;
            next.focus();
          }
          break;
        }
        case 'in':
          if (this.$options.children.length) this.$options.children[0].focus();
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
      this.expanded = false;
      super._onKeydown(event);
    }
  }
  _onOptionItemClicked(event) {
    if (event.composedPath()[0] !== this) {
      event.stopImmediatePropagation();
      this.set('value', event.detail.value);
      this.dispatchEvent('item-clicked', event.detail, true);
    }
  }
  optionChanged() {
    if (this._options) {
      if (!this.$options) {
        this.$options = new IoMenuOptions({
          $parent: this,
          expanded: this.bind('expanded'),
          'on-item-clicked': this._onOptionItemClicked,
          'on-expanded-changed': IoLayerSingleton.onChildExpanded,
        });
      }
    }
  }
  expandedChanged() {
    if (this.expanded) {
      if (this.$options && this.$options.parentElement !== IoLayerSingleton) {
        IoLayerSingleton.appendChild(this.$options);
      }
      const items = getElementDescendants(getRootElement(this));
      const ancestors = getElementAncestors(this);
      for (let i = items.length; i--;) {
        if (ancestors.indexOf(items[i]) === -1) {
          items[i].expanded = false;
        }
      }
      if (this.$options) {
        const descendants = getElementDescendants(this.$options);
        for (let i = descendants.length; i--;) {
          descendants[i].expanded = false;
        }
      }
    } else {
      const descendants = getElementDescendants(this);
      for (let i = descendants.length; i--;) {
        descendants[i].expanded = false;
      }
    }
  }
  changed() {
    this.__properties.selected.value = this._selected;
    this.setAttribute('selected', this._selected);
    this.setAttribute('hasmore', this._options && this.direction === 'right');
    this.template([
      ['span', {class: 'io-menu-icon'}, this._icon],
      ['span', {class: 'io-menu-label'}, this._label || String(this._value)],
      ['span', {class: 'io-menu-hint'}, this._hint],
    ]);
    if (this.$options) {
      this.$options.setProperties({
        value: this.value,
        options: this._options,
        selectable: this.selectable,
        position: this.direction,
      });
    }

  }
}

IoMenuItem.Register();
