import {html} from "../../io.js";
import {IoItem, IoLayerSingleton} from "../../io-elements-core.js";
import {IoMenuOptions} from "./menu-options.js";

export function filterObject(object, predicate) {
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
      }
      :host[expanded] {
        color: var(--io-color-link);
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
      :host {
        border: var(--io-border-width) solid transparent;
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
  // constructor(props) {
  //   super(props);
  //   this._menuRoot = null;
  //   this._hoveredItem = null;
  //   this._hoveredOptions = null;
  //   this._startAnimation = this._startAnimation.bind(this);
  //   this._stopAnimation = this._stopAnimation.bind(this);
  //   this._x = 0;
  //   this._y = 0;
  //   this._v = 0;
  //   this.addEventListener('focusin', this._onFocusIn, {capture: true});
  // }
  constructor(props) {
    super(props);
    // TODO: consider optimizing-out on leaf item elements.
    this.$options = new IoMenuOptions({
      $parent: this,
      expanded: this.bind('expanded'),
      'on-item-clicked': this._onOptionItemClicked,
      'on-expanded-changed': IoLayerSingleton.onChildExpanded,
    });
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
  get _rootElement() {
    let root = this;
    while (root && root.$parent) {
      root = root.$parent;
    }
    return root;
  }
  get _itemAncestors() {
    let elem = this;
    const elements = [this];
    while (elem && elem.$parent) {
      elem = elem.$parent;
      if (elem.localName === 'io-menu-item') elements.push(elem);
      if (elem.localName === 'io-menu-option') elements.push(elem);
    }
    return elements;
  }
  get _itemDescendants() {
    const elements = [this];
    const items = this.$options.querySelectorAll('io-menu-item, io-menu-option');
    for (let i = items.length; i--;) {
      elements.push(items[i]);
      if (items[i].expanded) elements.push(...items[i]._itemDescendants);
    }
    return elements;
  }
  _getHoveredItem(event) {
    const items = this._rootElement._itemDescendants;
    let _hoveredItem;
    for (let i = items.length; i--;) {
      if (items[i]._isPointerAboveElement(event)) {
        _hoveredItem = items[i];
        continue;
      }
    }
    return _hoveredItem;
  }
  connectedCallback() {
    super.connectedCallback();
    IoLayerSingleton.appendChild(this.$options);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoLayerSingleton.removeChild(this.$options);
  }
  _onFocus() {
    super._onFocus();
    const inLayer = this.$parent && this.$parent.parentElement === IoLayerSingleton;
    this.expanded = inLayer;
  }
  _onClick(event) {
    // TODO fix
    if (event.type === 'click') return;

    if (this._value || this._action) {
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
      this._rootElement.expanded = false;
    } else if (this._options) {
      this.expanded = true;
    }
  }
  _onTouchmove(event) {
    if (this.expanded && event.cancelable) event.preventDefault();
  }
  _onPointerdown(event) {
    super._onPointerdown(event);
    this.setPointerCapture(event.pointerId);
    if (this.expanded || event.pointerType === 'mouse') {
      this.focus();
      this.expanded = true;
    }
// this._x = event.clientX;
// this._y = event.clientY;
  }
  _onPointermove(event) {
    if (this._rootElement.expanded) {
      let _hoveredItem = this._getHoveredItem(event);
      if (_hoveredItem) {
        _hoveredItem.expanded = true;
        _hoveredItem.focus();
      }
    }
    // const movementX = event.clientX - this._x;
    // const movementY = event.clientY - this._y;
    // this._v = (2 * this._v + Math.abs(movementY) - Math.abs(movementX)) / 3;
    // this._x = event.clientX;
    // this._y = event.clientY;
    // let options = this.$options;
    // for (let i = options.length; i--;) {
    //   if (options[i].expanded) {
    //     let rect = options[i].getBoundingClientRect();
    //     if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
    //       this._hoveredOptions = options[i];
    //       let items = options[i].querySelectorAll('io-menu-item');
    //       for (let j = items.length; j--;) {
    //         const optionschain = this._getParentOptions(items[j]);
    //         let rect = items[j].getBoundingClientRect();
    //         if (optionschain.indexOf(this._menuRoot) !== -1) {
    //           if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
    //             let force = options[i].horizontal;
    //             this._focusItem(items[j], force);
    //             this._hoveredItem = items[j];
    //             return;
    //           }
    //         }
    //
    //       }
    //       return options[i];
    //     }
    //   }
    // }
    //
    // this._hoveredOptions = null;
    // this._hoveredItem = null;
    //
    // if (this.lastFocus) {
    //   let rect = this.lastFocus.getBoundingClientRect();
    //   if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
    //     this._focusItem(this.lastFocus);
    //     return;
    //   }
    // }
    //
    // let rect = this._menuRoot.getBoundingClientRect();
    // if (rect.top < this._y && rect.bottom > this._y && rect.left < this._x && rect.right > this._x) {
    //   this._hoveredItem = this._menuRoot;
    //   return;
    // }
  }
  _onPointerup(event) {
    let _hoveredItem = this._getHoveredItem(event);
    super._onPointerup(event);
    if (!_hoveredItem) {
      this.expanded = false;
    } else {
      _hoveredItem._onClick(event);
    }
  }
  _isPointerAboveElement(event) {
    const r = this.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    return (r.top < y && r.bottom > y && r.left < x && r.right > x);
  }
  // _focusItem(item, force) {
  //   if (item !== this.__prevItem) {
  //     const WAIT_TIME = 100;
  //     clearTimeout(this.__timeoutOpen);
  //     clearTimeout(this.__timeoutReset);
  //     if (this._v > 1 || item.parentNode !== this.__prevParent || force) {
  //       this.__prevItem = item;
  //       this._hoveredItem = item;
  //       if (typeof item._toggleExpanded === 'function') {
  //         item._toggleExpanded(true);
  //         item.focus();
  //         this.collapseSiblings(item);
  //       }
  //     } else {
  //       this.__timeoutOpen = setTimeout(function() {
  //         this.__prevItem = item;
  //         this._hoveredItem = item;
  //         if (typeof item._toggleExpanded === 'function') {
  //           item._toggleExpanded(true);
  //           item.focus();
  //           this.collapseSiblings(item);
  //         }
  //       }.bind(this), WAIT_TIME);
  //     }
  //     this.__prevParent = item.parentNode;
  //     this.__timeoutReset = setTimeout(function() {
  //       this.__prevItem = null;
  //       this.__prevParent = null;
  //     }.bind(this), WAIT_TIME + 1);
  //   }
  // }
  // _getParentOptions(item) {
  //   const chain = [];
  //   if (item.$options) chain.push(item.$options);
  //   let parent = item.$parent;
  //   while (parent) {
  //     chain.push(parent);
  //     parent = parent.$parent;
  //   }
  //   return chain;
  // }
  // _moveHovered() {
  //   let options = this._hoveredOptions;
  //   if (options) {
  //     let rect = options.getBoundingClientRect();
  //     if (rect.height > window.innerHeight) {
  //       if (this._y < 100 && rect.top < 0) {
  //         let scrollSpeed = (100 - this._y) / 5000;
  //         let overflow = rect.top;
  //         options._y = options._y - Math.ceil(overflow * scrollSpeed) + 1;
  //       } else if (this._y > window.innerHeight - 100 && rect.bottom > window.innerHeight) {
  //         let scrollSpeed = (100 - (window.innerHeight - this._y)) / 5000;
  //         let overflow = (rect.bottom - window.innerHeight);
  //         options._y = options._y - Math.ceil(overflow * scrollSpeed) - 1;
  //       }
  //       options.style.left = options._x + 'px';
  //       options.style.top = options._y + 'px';
  //     }
  //   }
  // }
  // _startAnimation() {
  //   this._moveHovered();
  //   this._rAF_ID = requestAnimationFrame(this._startAnimation);
  // }
  // _stopAnimation() {
  //   if (this._rAF_ID) cancelAnimationFrame(this._rAF_ID);
  // }
  _onKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.pressed = true;
      event.preventDefault();
      this._onClick(event);
      if (this.expanded) {
        if (this.$options.children.length) this.$options.children[0].focus();
      }
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this._rootElement.expanded = false;
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
    if (event.key === 'Tab') command = 'next';

    const inLayer = this.$parent && this.$parent.parentElement === IoLayerSingleton;
    const siblings = this.$parent ? [...this.$parent.children] : [];
    const index = siblings.indexOf(this);
    if (command && (inLayer || this.expanded)) {
      event.preventDefault();
      switch (command) {
        case 'prev':
          const prev = siblings[(index + siblings.length - 1) % (siblings.length)];
          this.expanded = false;
          prev.expanded = true;
          prev.focus();
          break;
        case 'next':
          const next = siblings[(index + 1) % (siblings.length)];
          this.expanded = false;
          next.expanded = true;
          next.focus();
          break;
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
      const items = this._rootElement._itemDescendants;
      const ancestors = this._itemAncestors;
      for (let i = items.length; i--;) {
        if (ancestors.indexOf(items[i]) === -1) {
          items[i].expanded = false;
        }
      }
    } else {
      const items = this._itemDescendants;
      for (let i = items.length; i--;) {
        items[i].expanded = false;
      }
    }
  }
  changed() {
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
