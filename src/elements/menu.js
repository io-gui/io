import {IoElement, html} from "../core/element.js";
import {Option} from "../types/option.js";
import {IoItem} from "./item.js";
import {IoMenuLayer} from "./menu-layer.js";

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
        border-radius: var(--io-border-radius);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        box-shadow: var(--io-shadow);
      }
      :host[horizontal] {
        flex-direction: row;
        align-self: stretch;
        flex-wrap: nowrap;
      }
      :host[horizontal] > * {
        padding: calc(2 * var(--io-spacing)) calc(4 * var(--io-spacing));
      }
      :host[horizontal] > io-menu-item > .io-menu-hint,
      :host[horizontal] > io-menu-item > .io-menu-more {
        display: none;
      }
      :host[horizontal] > io-menu-item.io-hamburger {
        line-height: 1.1em;
        margin-left: auto;
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
      value: null,
      overflow: {
        type: Boolean,
        reflect: true,
      },
      role: 'listbox',
      $parent: HTMLElement,
      _depth: 0,
      _rects: Array,
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
      event.stopImmediatePropagation();
      if (item.expanded) item.expanded = false;
      if (event.detail.value !== undefined) {
        this.set('value', event.detail.value);
        // IoMenuLayer.singleton.collapseAll(); // TODO? tabs?
      }
      if (this.$parent instanceof IoMenuItem || this.$parent instanceof IoMenu) {
        if (this.$parent.expanded) this.$parent.expanded = false;
        this.$parent.dispatchEvent('io-menu-item-clicked', event.detail, true);
      } else {
        this.dispatchEvent('io-menu-item-clicked', event.detail, true);
      }
    }
  }
  resized() {
    this.setOverflow();
  }
  setOverflow() {
    if (this.horizontal) {
      const buttons = this.querySelectorAll('io-menu-item:not(.io-hamburger)');
      const hamburger = this.querySelector('io-menu-item.io-hamburger');
      const rects = this._rects;
      rects.length = buttons.length;

      if (!rects.length) return;
      if (!buttons.length) return;

      let end = this.getBoundingClientRect().right;
      let overflow = false;
      let last = Infinity;
      hamburger.hidden = true;

      for (let i = buttons.length; i--;) {
        const r = buttons[i].getBoundingClientRect();
        rects[i] = rects[i] || {right: 0, width: 0};
        rects[i].right = r.right ? Math.max(rects[i].right, r.right) : rects[i].right;
        rects[i].width = r.width ? Math.max(rects[i].width, r.width) : rects[i].width;

        if (hamburger.hidden && overflow) {
          hamburger.hidden = false;
          end -= hamburger.getBoundingClientRect().width;
        }

        if (buttons[i].selected) {
          end -= rects[i].width;
          buttons[i].hidden = false;
          continue;
        }

        last = Math.min(last, rects[i].right);
        if (last < end) {
          buttons[i].hidden = false;
        } else {
         buttons[i].hidden = true;
          overflow = true;
        }
      }
      this.overflow = overflow;
    }
  }
  nudgeRight(x, y, rect) {
    if (x + rect.width < window.innerWidth) {
      this._x = x;
      this._y = Math.min(y, window.innerHeight - rect.height);
      return true;
    }
    return false;
  }
  nudgeLeft(x, y, rect) {
    if (x - rect.width > 0) {
      this._x = x - rect.width;
      this._y = Math.min(y, window.innerHeight - rect.height);
      return true;
    }
    return false;
  }
  nudgeBottom(x, y, rect) {
    if (y + rect.height < window.innerHeight) {
      this._y = y;
      this._x = Math.min(x, window.innerWidth - rect.width);
      return true;
    }
    return false;
  }
  nudgeTop(x, y, rect) {
    if (y - rect.height > 0) {
      this._y = y - rect.height;
      this._x = Math.min(x, window.innerWidth - rect.width);
      return true;
    }
    return false;
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
            this.nudgeTop(pRect.x, pRect.top, rect) ||
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeLeft(pRect.x, pRect.top, rect);
            break;
          case 'left':
            this.nudgeLeft(pRect.x, pRect.top, rect) ||
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgeTop(pRect.x, pRect.top, rect);
            break;
          case 'bottom':
            this.nudgeBottom(pRect.x, pRect.bottom, rect) ||
            this.nudgeTop(pRect.x, pRect.top, rect) ||
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeLeft(pRect.x, pRect.top, rect);
            break;
          case 'right':
          default:
            this.nudgeRight(pRect.right, pRect.top, rect) ||
            this.nudgeLeft(pRect.x, pRect.top, rect) ||
            this.nudgeBottom(pRect.right, pRect.bottom, rect) ||
            this.nudgeTop(pRect.right, pRect.top, rect);
            break;
        }
        this.style.left = this._x + 'px';
        this.style.top = this._y + 'px';
      }
    }
  }
  changed() {
    const itemDirection = this.horizontal ? 'bottom' : 'right';
    const options = this.options.map(option => { return new Option(option); });
    const elements = [options.map(option =>
      ['io-menu-item', {
        $parent: this,
        value: option.value,
        label: option.label,
        action: option.action,
        hint: option.hint,
        icon: option.icon,
        options: option.options || [],
        selected: option.selected || option.value === this.value,
        direction: itemDirection,
        _depth: this._depth + 1,
      }]
    )];
    if (this.horizontal) {
      // TODO: Detect selectedSubOption selected!
      elements.push(['io-menu-item', {
        label: '☰',
        title: 'select tab',
        value: this.value,
        options: this.options,
        class: 'io-hamburger',
      }]);
    }
    this.template(elements);
    this.setOverflow();
  }
}

export class IoMenuItem extends IoItem {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        padding: calc(2 * var(--io-spacing));
        background: none;
      }
      :host > * {
        padding: 0 var(--io-spacing);
        pointer-events: none;
      }
      :host > .io-menu-icon {}
      :host > .io-menu-label {
        flex: 1 1 auto;
        overflow: hidden;
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
  static get properties() {
    return {
      expanded: Boolean,
      icon: String,
      hint: String,
      options: Array,
      direction: {
         value: 'bottom',
         reflect: true,
      },
      action: Function,
      // button: HTMLElement, // TODO: add button ref ?
      $parent: HTMLElement,
      $options: IoMenuOptions,
      _depth: 0,
    };
  }
  get compose() {
    return {
      $options: {
        $parent: this,
        expanded: this.bind('expanded'),
        options: this.options,
        // selected: this.options.selected,
        position: this.direction,
        _depth: this._depth,
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this._connectOptions();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._disconnectOptions();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _connectOptions() {
    if (this.options.length) {
      if (!this.$options.parentNode) {
        IoMenuLayer.singleton.appendChild(this.$options);
      }
      // this.$options.selected = this.options.selected;
    } else this._disconnectOptions();
  }
  _disconnectOptions() {
    if (this.$options.parentNode) {
      this.$options.parentNode.removeChild(this.$options);
    }
  }
  _toggleExpanded(set) {
    if (this.options.length) this.expanded = set !== undefined ? set : !this.expanded;
    else this.expanded = false;
  }
  _focusIn() {
    IoMenuLayer.singleton.setLastFocus(this);
    if (this.expanded) setTimeout(() => {
      if (this.$options.children.length) this.$options.children[0].focus();
    });
  }
  _focusOut() {
    if (this.$parent && this.$parent.$parent) {
      this.$parent.expanded = false;
      this.$parent.$parent.expanded = false;
      this.$parent.$parent.focus();
    }
  }
  _onMousedown() {
    IoMenuLayer.singleton.setLastFocus(this);
    this.focus();
    this._toggleExpanded(true);
    IoMenuLayer.singleton._onMousemove(event);
  }
  _onTouchstart(event) {
    if (event.cancelable) {
      event.preventDefault();
      this.addEventListener('touchmove', this._onTouchmove);
      this.addEventListener('touchend', this._onTouchend);
      IoMenuLayer.singleton.setLastFocus(this);
      this.focus();
      this._toggleExpanded(true);
      IoMenuLayer.singleton._onTouchmove(event);
    }
  }
  _onTouchmove(event) {
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    event.preventDefault();
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
  _onKeydown(event) {
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

    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      if (this.options.length) {
        this._toggleExpanded(true);
        this._focusIn();
      } else {
        this._onClick();
      }
    }
    else if (event.key === 'Escape') {
      event.preventDefault();
      IoMenuLayer.singleton.collapseAll();
    } else if (this.$parent && this.$parent.parentElement === IoMenuLayer.singleton) {
      const options = this.$parent;
      const siblings = [...options.children];
      const index = siblings.indexOf(this);
      if (command) event.preventDefault();
      switch (command) {
        case 'prev':
          this.expanded = false;
          siblings[(index + siblings.length - 1) % (siblings.length)].focus();
          break;
        case 'next':
          this.expanded = false;
          siblings[(index + 1) % (siblings.length)].focus();
          break;
        case 'in':
          this._focusIn();
          break;
        case 'out':
          this.expanded = false;
          this._focusOut();
          break;
        default:
          break;
      }
    } else {
      if (this.expanded && command === 'in') {
        this._focusIn();
      } else {
        this.expanded = false;
        super._onKeydown(event);
      }
    }
  }
  _onClick() {
    if (typeof this.action === 'function') {
      this.action.apply(null, [this.value]);
    }
    if (this.value !== undefined) {
      this.dispatchEvent('io-menu-item-clicked', {value: this.value}, true);
    }
  }
  _onFocus() {
    super._onFocus();
    if (this.$parent && this.$parent.parentElement === IoMenuLayer.singleton) {
      this._toggleExpanded(true);
    }
  }
  expandedChanged() {
    if (this.expanded && this.$parent) this.$parent.expanded = true;
  }
  optionsChanged() {
    this._connectOptions();
    this.setAttribute('hasmore', !!this.options.length && this.direction === 'right');
  }
  changed() {
    this.template([
      this.icon ? ['span', {class: 'io-menu-icon'}, this.icon] : null,
      ['span', {class: 'io-menu-label'}, this.label || String(this.value)],
      this.hint ? ['span', {class: 'io-menu-hint'}, this.hint] : null,
    ]);
  }
}

IoMenuItem.Register();
IoMenuOptions.Register();
IoMenu.Register();
