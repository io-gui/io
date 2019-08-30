import {html} from "../../io.js";
import {IoItem, IoLayerSingleton} from "../../io-elements-core.js";
import {IoMenuOptions} from "./menu-options.js";

function filterObject(object, predicate) {
  if (predicate(object)) return object;
  for (let key in object) {
    if (predicate(object[key])) {
        return object[key];
    } else if (typeof object[key] === 'object') {
      const prop = filterObject(object[key], predicate);
      if (prop) return prop;
    }
  }
}

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
  if (r.top < 0 || r.bottom > window.innerHeight || r.left < 0 || r.right > window.innerWidth) return false;
  return (r.top < y && r.bottom > y && r.left < x && r.right > x);
}

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
      option: Object,
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
  constructor(props) {
    super(props);
    // TODO: consider optimizing-out on leaf item elements.
    this.$options = new IoMenuOptions({
      $parent: this,
      expanded: this.bind('expanded'),
      'on-item-clicked': this._onOptionItemClicked,
      'on-expanded-changed': IoLayerSingleton.onChildExpanded,
    });
    Object.defineProperty(this, '_v', {value: 0, writable: true});
    Object.defineProperty(this, '_p', {value: null, writable: true});
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
    if (options) return !!filterObject(options, (o) => { return o === this.value || o.value === this.value; });
    return false;
  }
  get _inLayer() {
    return this.$parent && this.$parent.parentElement === IoLayerSingleton;
  }
  connectedCallback() {
    super.connectedCallback();
    IoLayerSingleton.appendChild(this.$options);
    if (!this._inLayer) {
      IoLayerSingleton.addEventListener('pointermove', this._onLayerPointermove);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoLayerSingleton.removeChild(this.$options);
    IoLayerSingleton.removeEventListener('pointermove', this._onLayerPointermove);
  }
  _onClick(event) {
    // TODO unhack (prevents _onClick on pointer origin on release)
    if (event.type === 'click') {
      console.log('asd');
      return;
    }
    //
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
    this._v = 0;
    this._p = this.parentElement;
  }
  _getHoveredItem(event) {
    const items = getElementDescendants(getRootElement(this));
    let _hoveredItem;
    for (let i = items.length; i--;) {
      if (isPointerAboveElement(event, items[i])) {
        _hoveredItem = items[i];
        continue;
      }
    }
    return _hoveredItem;
  }
  _onPointermove(event) {
    if (!this.expanded && event.pointerType === 'touch' && !this._inLayer) {
      return;
    }
    IoLayerSingleton._x = event.clientX;
    IoLayerSingleton._y = event.clientY;
    // TODO: consider horizintal menus
    clearTimeout(this.__timeoutOpen);
    this._v = (2 * this._v + Math.abs(event.movementY) - Math.abs(event.movementX)) / 3;
    let _hoveredItem = this._getHoveredItem(event);
    if (_hoveredItem) {
      const WAIT_TIME = 100;
      if (this._p !== _hoveredItem.parentElement) {
        this._p = _hoveredItem.parentElement;
        _hoveredItem.focus();
        if (_hoveredItem._options) _hoveredItem.expanded = true;

        const descendants = getElementDescendants(_hoveredItem.$options);
        for (let i = descendants.length; i--;) {
          descendants[i].expanded = false;
        }

      } else if (this._v > 0.5) {
        _hoveredItem.focus();
        if (_hoveredItem._options) _hoveredItem.expanded = true;
      } else {
        this.__timeoutOpen = setTimeout(() => {
          _hoveredItem.focus();
          if (_hoveredItem._options) _hoveredItem.expanded = true;
        }, WAIT_TIME);
      }
    }
  }
  _onLayerPointermove(event) {
    if (this.expanded) this._onPointermove(event);
  }
  _onPointerup(event) {
    this.removeEventListener('pointermove', this._onPointermove);
    this.removeEventListener('pointerup', this._onPointerup);
    this.pressed = false;
    let _hoveredItem = this._getHoveredItem(event);
    if (!_hoveredItem) {
      this.expanded = false;
    } else {
      _hoveredItem._onClick(event);
    }
  }
  _onKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true;
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
  expandedChanged() {
    if (this.expanded) {
      const items = getElementDescendants(getRootElement(this));
      const ancestors = getElementAncestors(this);
      for (let i = items.length; i--;) {
        if (ancestors.indexOf(items[i]) === -1) {
          items[i].expanded = false;
        }
      }
      const descendants = getElementDescendants(this.$options);
      for (let i = descendants.length; i--;) {
        descendants[i].expanded = false;
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
    // TODO: consider optimizing-out on leaf item elements.
    this.$options.setProperties({
      value: this.value,
      options: this._options,
      selectable: this.selectable,
      position: this.direction,
    });
  }
}

IoMenuItem.Register();
