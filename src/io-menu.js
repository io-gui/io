import {IoBase, html} from "./io-base.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuGroup} from "./io-menu-group.js"

class IoMenu extends IoBase {
  static get is() { return 'io-menu'; }
  static get properties() {
    return {
      options: {
        type: Array,
        observer: '_updateJob'
      },
      expanded: {
        type: Boolean
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
    this.$group = new IoMenuGroup({$parent: this});
  }
  connectedCallback() {
    super.connectedCallback();
    this.$parent = this.parentElement || this.parentNode.host;
    this.$parent.addEventListener(this.listener, this._expandListener);
    IoMenuLayer.singleton.appendChild(this.$group);
    this._binding = this.bind('expanded', this.$group, 'expanded');
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.$parent.removeEventListener(this.listener, this._expandListener);
    IoMenuLayer.singleton.removeChild(this.$group);
    this.unbind(this._binding);
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
    this.$group.position = this.position;
  }
}

window.customElements.define(IoMenu.is, IoMenu);

export { IoMenu }
