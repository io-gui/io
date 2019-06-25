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
    if (this.button === 2) {
      event.preventDefault();
      this.open(event);
    }
  }
  _onMousedown(event) {
    if (event.button === this.button && event.button !== 2) {
      this.open(event);
    }
  }
  _onTouchstart(event) {
    if (this.button !== 2) {
      event.preventDefault();
      this.open(event.changedTouches[0]);
    }
    this.parentElement.addEventListener('touchmove', this._onTouchmove);
    this.parentElement.addEventListener('touchend', this._onTouchend);
  }
  _onTouchmove(event) {
    if (this.expanded) event.preventDefault();
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    this.parentElement.removeEventListener('touchmove', this._onTouchmove);
    this.parentElement.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
  open(event) {
    IoMenuLayer.singleton.collapseAll();
    this.$options._x = event.clientX;
    this.$options._y = event.clientY;
    window.getSelection().removeAllRanges();
    this.expanded = true;
  }
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
        type: Boolean,
        reflect: true
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: true
      },
      role: 'listbox',
      $parent: HTMLElement,
      depth: 0,
    };
  }
  static get listeners() {
    return {
      'io-menu-item-clicked': '_onMenuItemClicked',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.parentElement === IoMenuLayer.singleton) {
      IoMenuLayer.singleton.registerOptions(this);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.parentElement === IoMenuLayer.singleton) {
      IoMenuLayer.singleton.unregisterOptions(this);
    }
  }
  _onMenuItemClicked(event) {
    const path = event.composedPath();
    if (path[0] !== this) {
      if (path[0].expanded) path[0].expanded = false;
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
         // TODO: unhack horizontal long submenu bug.
        if (this.position === 'bottom' && rect.height > (window.innerHeight - this._y)) this.position = 'right';
        //
        switch (this.position) {
          case 'pointer':
            this._x = this._x - 1 || pRect.x;
            this._y = this._y - 1 || pRect.y;
            break;
          case 'top':
            this._x = pRect.x;
            this._y = pRect.top - rect.height;
            break;
          case 'left':
            this._x = pRect.x - rect.width;
            this._y = pRect.top;
            break;
          case 'bottom':
            this._x = pRect.x;
            this._y = pRect.bottom;
            break;
          case 'right':
          default:
            this._x = pRect.right;
            this._y = pRect.y;
            if ((this._x + rect.width > window.innerWidth) && pRect.x > 20) {
              this._x = pRect.x - rect.width;
            }
            break;
        }
        this._x = Math.max(0, Math.min(this._x, window.innerWidth - rect.width));
        this._y = Math.min(this._y, window.innerHeight - rect.height);
        this.style.left = this._x + 'px';
        this.style.top = this._y + 'px';
      }
    }
  }
  optionsChanged() {
    const itemPosition = this.horizontal ? 'bottom' : 'right';
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
        position: itemPosition,
        depth: this.depth + 1,
      }]
    )]);
  }
}

IoMenu.Register();
IoMenuOptions.Register();
