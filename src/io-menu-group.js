import {IoBase, html} from "./io-base.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuOption} from "./io-menu-option.js"

export class IoMenuGroup extends IoBase {
  static get is() { return 'io-menu-group'; }
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          visibility: hidden;
          flex-direction: column;
          position: absolute;
          top: 0;
          left: 0;
          background: white;
          white-space: nowrap;
          padding: 0.125em 0.25em;
          border: 1px solid #666;
          box-shadow: 1px 1px 2px rgba(0,0,0,0.33);
          min-width: 6em;
        }
        :host([expanded]) {
          visibility: visible;
        }
      </style><slot></slot>
    `;
  }
  static get properties() {
    return {
      options: {
        type: Array,
        observer: '_updateJob'
      },
      expanded: {
        type: Boolean,
        notify: true,
        observer: '_expandedChanged',
        reflectToAttribute: true
      },
      position: {
        type: String,
        value: 'pointer',
        observer: '_updateJob'
      },
      $parent: {
        type: HTMLElement
      }
    }
  }
  constructor(props) {
    super(props);
    this.__animate = this._animate.bind(this);
    this._updateJob();
  }
  connectedCallback() {
    super.connectedCallback();
    this._rect = this.getBoundingClientRect();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  _update() {
    this.$options = [];
    if (this.options) {
      for (var i = 0; i < this.options.length; i++) {
        this.$options[i] = new IoMenuOption({option: this.options[i], $parent: this});
        this.appendChild(this.$options[i]);
      }
    }
  }
  _expandedChanged(value, oldValue) {
    if (this.expanded) {
      this._startAnimation();
      this._setPosition();
    } else {
      this._stopAnimation();
      for (var i = 0; i < this.$options.length; i++) {
        // TODO: redundant???
        if (this.$options[i].$group)
            this.$options[i].$group.expanded = false;
      }
    }
  }
  _startAnimation() {
    if (!this._playing) {
      this._playing = true;
      this._animate();
    }
  }
  _stopAnimation() {
    this._playing = false;
  }
  _animate() {
    if (!this._playing) return;
    requestAnimationFrame(this.__animate);
    this._scroll();
  }
  _setPosition() {
    this._rect = this.getBoundingClientRect();
    this._pRect = this.$parent.getBoundingClientRect();
    switch (this.position) {
      case 'pointer':
        this._x = this._x - 2 || this._pRect.left;
        this._y = this._y - 2 || this._pRect.top;
        break;
      case 'bottom':
        this._x = this._pRect.left;
        this._y = this._pRect.bottom;
        break;
      case 'right':
        this._x = this._pRect.right;
        this._y = this._pRect.top;
        if (this._x + this._rect.width > window.innerWidth) {
          this._x = this._pRect.left - this._rect.width;
        }
        break;
      case 'top':
      default:
        this._x = this._pRect.left;
        this._y = this._pRect.top;
        break;
    }
    this._x = Math.min(this._x, window.innerWidth - this._rect.width);
    this._y = Math.min(this._y, window.innerHeight - this._rect.height);
    this.style.left = this._x + 'px';
    this.style.top = this._y + 'px';
  }
  _scroll() {
    this._rect = this.getBoundingClientRect();
    let scrollSpeed, overflow;
    let x = IoMenuLayer.singleton._pointer.x;
    let y = IoMenuLayer.singleton._pointer.y;
    if (this._rect.height > window.innerHeight) {
      if (y < 100 && this._rect.top < 0) {
        scrollSpeed = (100 - y) / 5000;
        overflow = this._rect.top;
        this._y = this._y - Math.ceil(overflow * scrollSpeed) + 1;
      } else if (y > window.innerHeight - 100 && this._rect.bottom > window.innerHeight) {
        scrollSpeed = (100 - (window.innerHeight - y)) / 5000;
        overflow = (this._rect.bottom - window.innerHeight);
        this._y = this._y - Math.ceil(overflow * scrollSpeed) - 1;
      }
      this.style.left = this._x + 'px';
      this.style.top = this._y + 'px';
    }
  }
}

window.customElements.define(IoMenuGroup.is, IoMenuGroup);
