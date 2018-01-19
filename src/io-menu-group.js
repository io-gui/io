import {IoBase, html} from "./io-base.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuOption} from "./io-menu-option.js"

class IoMenuGroup extends IoBase {
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
        value: false,
        observer: '_expandedChanged',
        reflectToAttribute: true
      },
      /* 'top', 'bottom', 'right' and 'pointer' */
      position: {
        type: String,
        value: 'pointer',
        observer: '_updateJob'
      }
    }
  }
  constructor(props) {
    super(props);
    // this._animate = this.animate.bind(this);
    // this._updateJob();
  }
  _update() {
    this.$options = [];
    console.log(this.options);
    for (var i = 0; i < this.options.length; i++) {
      this.$options[i] = new IoMenuOption({option: this.options[i]});
      this.appendChild(this.$options[i]);
    }
    // this.$group = new IoMenuGroup({options: this.options, expanded: this.expanded, position: this.position});
  }
  _expandedChanged(value, oldValue) {
    // setTimeout(function () {
    //   if (this.expanded) {
    //     this.startAnimation();
    //     this._setPosition();
    //   } else {
    //     this.stopAnimation();
    //     let options = this.shadowRoot.querySelectorAll('io-menu-option');
    //     for (var i = 0; i < options.length; i++) {
    //       options[i]._menuGroup.expanded = false;
    //     }
    //   }
    // }.bind(this));
    this.dispatchEvent(new CustomEvent('expanded-changed', {
      detail: {value: value, oldValue: oldValue},
      bubbles: true,
      composed: true
    }));
  }
  startAnimation() {
    if (!this.playing) {
      this.playing = true;
      this.animate();
    }
  }
  stopAnimation() {
    this.playing = false;
  }
  animate() {
    if (!this.playing) return;
    this._scroll();
    requestAnimationFrame(this._animate);
  }
  _setPosition() {
    this._rect = this.getBoundingClientRect();
    this._parentRect = this._parent.getBoundingClientRect();
    switch (this.position) {
      case 'pointer':
        // when opened by attribute, "pointer" position behaves as "top"
        this._x = (this._x || this._parentRect.left) - 2;
        this._y = (this._y || this._parentRect.top) - 2;
        this._y = Math.min(this._y, window.innerHeight - this._rect.height);
        break;
      case 'bottom':
        this._x = this._parentRect.left;
        this._y = this._parentRect.bottom;
        break;
      case 'right':
        this._x = this._parentRect.right;
        this._y = this._parentRect.top;
        if (this._x + this._rect.width > window.innerWidth) {
          this._x = this._parentRect.left - this._rect.width;
        }
        break;
      case 'top':
      default:
        this._x = this._parentRect.left;
        this._y = this._parentRect.top;
        break;
    }
    this._x = Math.min(this._x, window.innerWidth - this._rect.width);
    this.style.left = this._x + 'px';
    this.style.top = this._y + 'px';
  }
  // Scroll by pointer if menu group cannot fit the window.
  // TODO: also scroll on key commands
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

export { IoMenuGroup };
