import {IoElement, html} from "../core/element.js";
import {validateOptionObject} from "../utils/utility-functions.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuItem} from "./menu-item.js";

export class IoMenu extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      button: 0,
      $options: IoMenuOptions,
    };
  }
  get compose() {
    return {
      $options: {
        $parent: this,
        expanded: this.bind('expanded'),
        options: this.options,
        position: this.position,
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.parentElement.addEventListener('contextmenu', this._onContextmenu);
    this.parentElement.addEventListener('mousedown', this._onMousedown);
    this.parentElement.addEventListener('touchstart', this._onTouchstart);
    IoMenuLayer.singleton.appendChild(this.$options);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.parentElement.removeEventListener('contextmenu', this._onContextmenu);
    this.parentElement.removeEventListener('mousedown', this._onMousedown);
    this.parentElement.removeEventListener('touchstart', this._onTouchstart);
    this.parentElement.removeEventListener('touchmove', this._onTouchmove);
    this.parentElement.removeEventListener('touchend', this._onTouchend);
    if (this.$options) IoMenuLayer.singleton.removeChild(this.$options);
  }
  getBoundingClientRect() {
    return this.parentElement.getBoundingClientRect();
  }
  _onContextmenu(event) {
    if (this.options.length && this.button === 2) {
      event.preventDefault();
      this.expanded = true;
      this.$options.children[0].focus();
    }
  }
  _onMousedown(event) {
    if (this.options.length && event.button === this.button && event.button !== 2) {
      event.preventDefault();
      this.expanded = true;
      this.$options.children[0].focus();
    }
  }
  _onTouchstart(event) {
    if (this.options.length && event.cancelable && this.button !== 2) {
      event.preventDefault();
      this.parentElement.addEventListener('touchmove', this._onTouchmove);
      this.parentElement.addEventListener('touchend', this._onTouchend);
      this.expanded = true;
      this.$options.children[0].focus();
    }
  }
  _onTouchmove(event) {
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    this.parentElement.removeEventListener('touchmove', this._onTouchmove);
    this.parentElement.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
}

function nudgeRight(elem, x, y, rect) {
  if (x + rect.width < window.innerWidth) {
    elem._x = x;
    elem._y = Math.min(y, window.innerHeight - rect.height);
    return true;
  }
  return false;
}
function nudgeLeft(elem, x, y, rect) {
  if (x - rect.width > 0) {
    elem._x = x - rect.width;
    elem._y = Math.min(y, window.innerHeight - rect.height);
    return true;
  }
  return false;
}
function nudgeBottom(elem, x, y, rect) {
  if (y + rect.height < window.innerHeight) {
    elem._y = y;
    elem._x = Math.min(x, window.innerWidth - rect.width);
    return true;
  }
  return false;
}
function nudgeTop(elem, x, y, rect) {
  if (y - rect.height > 0) {
    elem._y = y - rect.height;
    elem._x = Math.min(x, window.innerWidth - rect.width);
    return true;
  }
  return false;
}
function nudgeClip(elem, x, y) {  // TODO: Better handling of small screens and large menus!
  elem._x = Math.max(0, x);
  elem._y = Math.max(0, y);
}

export class IoMenuOptions extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        user-select: none;
        touch-action: none;
        background: var(--io-background-color);
        color: var(--io-color);
        padding: var(--io-spacing);
        border-radius: var(--io-border-radius);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        box-shadow: var(--io-shadow);
      }
      :host[horizontal] {
        flex-direction: row;
        align-self: stretch;
      }
      :host[horizontal] > io-menu-item {
        margin: 0 0.5em;
      }
      :host[horizontal] > io-menu-item > .io-menu-hint,
      :host[horizontal] > io-menu-item > .io-menu-more {
        display: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      expanded: {
        value: true,
        reflect: true
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: true
      },
      role: 'listbox',
      $parent: HTMLElement,
      _depth: 0,
    };
  }
  static get listeners() {
    return {
      'io-menu-item-clicked': '_onMenuItemClicked',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    IoMenuLayer.singleton.registerOptions(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoMenuLayer.singleton.unregisterOptions(this);
  }
  _onMenuItemClicked(event) {
    const item = event.composedPath()[0];
    if (item !== this) {
      if (item.expanded) item.expanded = false;
      event.stopPropagation();
      if (this.$parent instanceof IoMenuItem || this.$parent instanceof IoMenu) {
        if (this.$parent.expanded) this.$parent.expanded = false;
        this.$parent.dispatchEvent('io-menu-item-clicked', event.detail, true);
      } else {
        this.dispatchEvent('io-menu-item-clicked', event.detail, true);
      }
    }
  }
  expandedChanged() {
    if (this.parentElement === IoMenuLayer.singleton) {
      IoMenuLayer.singleton._onOptionsExpanded(this);
      if (this.expanded && this.$parent) {
        let rect = this.getBoundingClientRect();
        let pRect = this.$parent.getBoundingClientRect();
        switch (this.position) {
          case 'pointer':
            this._x = this._x - 1 || pRect.x;
            this._y = this._y - 1 || pRect.y;
            break;
          case 'top':
            nudgeTop(this, pRect.x, pRect.top, rect) ||
            nudgeBottom(this, pRect.x, pRect.bottom, rect) ||
            nudgeRight(this, pRect.right, pRect.top, rect) ||
            nudgeLeft(this, pRect.x, pRect.top, rect) ||
            nudgeClip(this, pRect.x, pRect.top - rect.height);
            break;
          case 'left':
            nudgeLeft(this, pRect.x, pRect.top, rect) ||
            nudgeRight(this, pRect.right, pRect.top, rect) ||
            nudgeBottom(this, pRect.x, pRect.bottom, rect) ||
            nudgeTop(this, pRect.x, pRect.top, rect) ||
            nudgeClip(this, pRect.x - rect.width, pRect.top);
            break;
          case 'bottom':
            nudgeBottom(this, pRect.x, pRect.bottom, rect) ||
            nudgeTop(this, pRect.x, pRect.top, rect) ||
            nudgeRight(this, pRect.right, pRect.top, rect) ||
            nudgeLeft(this, pRect.x, pRect.top, rect) ||
            nudgeClip(this, pRect.x, pRect.bottom);
            break;
          case 'right':
          default:
            nudgeRight(this, pRect.right, pRect.top, rect) ||
            nudgeLeft(this, pRect.x, pRect.top, rect) ||
            nudgeBottom(this, pRect.right, pRect.bottom, rect) ||
            nudgeTop(this, pRect.right, pRect.top, rect) ||
            nudgeClip(this, pRect.right, pRect.top);
            break;
        }
        this.style.left = this._x + 'px';
        this.style.top = this._y + 'px';
      }
    }
  }
  horizontalChanged() {
    this.optionsChanged();
  }
  optionsChanged() {
    const itemDirection = this.horizontal ? 'bottom' : 'right';
    const options = this.options.map(validateOptionObject);
    this.template([options.map((elem, i) =>
      ['io-menu-item', {
        $parent: this,
        value: options[i].value,
        label: options[i].label,
        action: options[i].action,
        button: options[i].button,
        hint: options[i].hint,
        icon: options[i].icon,
        options: options[i].options || [],
        direction: itemDirection,
        _depth: this._depth + 1,
      }]
    )]);
  }
}

IoMenu.Register();
IoMenuOptions.Register();
