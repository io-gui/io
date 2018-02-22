import {Io} from "../../io/io.js"
import {UiMenuLayer} from "./ui-menu-layer.js"
import {UiMenuGroup} from "./ui-menu-group.js"

export class UiMenu extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: inline-block;
          background: black;
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
        type: Boolean
      },
      position: {
        value: 'top',
        type: String
      },
      listener: {
        type: String,
        value: 'click'
      }
    }
  }
  constructor(props) {
    super(props);
    this.$group = new UiMenuGroup({
      $parent: this,
      position: this.bind('position'),
      options: this.bind('options'),
      expanded: this.bind('expanded')
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.$parent = this.parentElement || this.parentNode.host;
    if (this.listener) this.$parent.addEventListener(this.listener, this._expandHandler);
    UiMenuLayer.singleton.appendChild(this.$group);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.listener) this.$parent.removeEventListener(this.listener, this._expandHandler);
    UiMenuLayer.singleton.removeChild(this.$group);
  }
  getBoundingClientRect() {
    if (this.$parent) return this.$parent.getBoundingClientRect();
    else return document.body.getBoundingClientRect();
  }
  _expandHandler(event) {
    UiMenuLayer.singleton.collapseAll();
    UiMenuLayer.singleton.pointer.x = event.clientX;
    UiMenuLayer.singleton.pointer.y = event.clientY;
    this.expanded = true;
  }
}

window.customElements.define('ui-menu', UiMenu);
