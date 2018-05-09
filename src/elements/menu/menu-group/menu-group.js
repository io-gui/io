import {Io, html} from "../../../iocore.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuItem} from "../menu-item/menu-item.js";

export class MenuGroup extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: none;
          flex-direction: column;
          position: absolute;
          transform: translateZ(0);
          top: 0;
          left: 0;
          background: white;
          white-space: nowrap;
          padding: 0.125em 0 0.25em 0;
          border: 1px solid #666;
          box-shadow: 1px 1px 2px rgba(0,0,0,0.33);
          min-width: 6em;
        }
        :host[expanded] {
          display: flex;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      options: {
        type: Array
      },
      expanded: {
        type: Boolean,
        notify: true,
        observer: '_expandedChanged',
        reflect: true
      },
      position: {
        type: String,
        value: 'right',
        observer: '_setPosition'
      },
      $parent: {
        type: HTMLElement
      },
      $options: {
        type: Array
      }
    };
  }
  constructor(props) {
    super(props);
    this._x = 0;
    this._y = 0;
    let frag = document.createDocumentFragment();
    for (let i = 0; i < this.options.length; i++) {
      this.$options[i] = new MenuItem({option: this.options[i], $parent: this});
      frag.appendChild(this.$options[i]);
    }
    this.appendChild(frag);
  }
  _expandedChanged() {
    if (this.expanded) {
      this._startAnimation();
      this._setPosition();
    } else {
      this._stopAnimation();
    }
  }
  _startAnimation() {
    if (!this._playing) {
      this._playing = true;
      this._animateHandler();
    }
  }
  _stopAnimation() {
    this._playing = false;
  }
  _animateHandler() {
    if (!this._playing) return;
    requestAnimationFrame(this._animateHandler);
    this._scroll();
  }
  _setPosition() {
    this._rect = this.getBoundingClientRect();
    this._pRect = this.$parent.getBoundingClientRect();
    switch (this.position) {
      case 'pointer':
        this._x = MenuLayer.singleton.pointer.x - 2 || this._pRect.x;
        this._y = MenuLayer.singleton.pointer.y - 2 || this._pRect.y;
        break;
      case 'bottom':
        this._x = this._pRect.x;
        this._y = this._pRect.bottom;
        break;
      case 'right':
        this._x = this._pRect.right;
        this._y = this._pRect.y;
        if (this._x + this._rect.width > window.innerWidth) {
          this._x = this._pRect.x - this._rect.width;
        }
        break;
      case 'top':
      default:
        this._x = this._pRect.x;
        this._y = this._pRect.y;
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
    let y = MenuLayer.singleton.pointer.y;
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

MenuGroup.Register();
