import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoMenuLayer} from "./io-menu-layer.js"
import {IoMenuGroup} from "./io-menu-group.js"

export class IoMenu extends Io {
  static get is() { return 'io-menu'; }
  static get properties() {
    return {
      options: {
        type: Array,
        observer: '_update'
      },
      expanded: {
        type: Boolean
      },
      position: {
        value: 'top',
        type: String,
        observer: '_update'
      },
      listener: {
        type: String,
        value: 'click'
      }
    }
  }
  connectedCallback() {
    // TODO: render
    this.$group = new IoMenuGroup({$parent: this, position: this.position, options: this.options});
    this.$parent = this.parentElement || this.parentNode.host;
    this.$parent.addEventListener(this.listener, this._expandHandler);
    IoMenuLayer.singleton.appendChild(this.$group);
    this._binding = this.bind('expanded', this.$group, 'expanded');
  }
  disconnectedCallback() {
    this.$parent.removeEventListener(this.listener, this._expandHandler);
    IoMenuLayer.singleton.removeChild(this.$group);
    this.unbind(this._binding);
  }
  getBoundingClientRect() {
    if (this.$parent) return this.$parent.getBoundingClientRect();
    else return document.body.getBoundingClientRect();
  }
  _expandHandler(event) {
    IoMenuLayer.singleton.collapseAll();
    IoMenuLayer.singleton.pointer.x = event.clientX;
    IoMenuLayer.singleton.pointer.y = event.clientY;
    this.expanded = true;
  }
  _update() {
    this.$group.options = this.options;
    this.$group.position = this.position;
  }
}

window.customElements.define(IoMenu.is, IoMenu);
