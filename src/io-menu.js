import {IoBase, html} from "./io-base.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuGroup} from "./io-menu-group.js"

class IoMenu extends IoBase {
  static get is() { return 'io-menu'; }
  static get template() {
    return html`
      <style>
      :host {
        display: none;
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
        observer: '_updateJob'
      },
      position: {
        value: 'top',
        type: String,
        observer: '_updateJob'
      },
      disabled: {
        type: Boolean
      },
      listener: {
        type: String,
        value: 'click'
      }
    }
  }
  constructor(props) {
    super(props);
    this._expandListener = this._expandHandler.bind(this);
    this.$group = new IoMenuGroup();
  }
  connectedCallback() {
    super.connectedCallback();
    this.$group._parent = this.parentNode.host || this.parentNode;
    this.$group._parent.addEventListener(this.listener, this._expandListener);
    IoMenuLayer.singleton.appendChild(this.$group);
    // this.$group.addEventListener('io-menu-option-clicked', function (event) {
    //   event.stopPropagation();
    //   this.dispatchEvent(new CustomEvent('io-menu-option-clicked', {
    //     detail: event.detail,
    //     bubbles: true,
    //     composed: true
    //   }));
    // }.bind(this))
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.$group._parent.removeEventListener(this.listener, this._expandListener);
    IoMenuLayer.singleton.removeChild(this.$group);
  }
  _expandHandler(event) {
    if (this.disabled) return;
    IoMenuLayer.singleton.collapseAll();
    this.$group._x = event.clientX;
    this.$group._y = event.clientY;
    this.expanded = true;
  }
  _update() {
    this.$group.options = this.options;
    this.$group.expanded = this.expanded;
    this.$group.position = this.position;
  }
}

window.customElements.define(IoMenu.is, IoMenu);

export { IoMenu }
