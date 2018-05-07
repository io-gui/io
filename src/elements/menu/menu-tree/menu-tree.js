import {Io, html} from "../../../iocore.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuGroup} from "../menu-group/menu-group.js";

export class MenuTree extends Io {
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
    };
  }
  constructor(props) {
    super(props);
    this.$group = new MenuGroup({
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
    MenuLayer.singleton.appendChild(this.$group);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.listener) this.$parent.removeEventListener(this.listener, this._expandHandler);
    MenuLayer.singleton.removeChild(this.$group);
  }
  getBoundingClientRect() {
    if (this.$parent) return this.$parent.getBoundingClientRect();
    else return document.body.getBoundingClientRect();
  }
  _expandHandler(event) {
    MenuLayer.singleton.collapseAll();
    MenuLayer.singleton.pointer.x = event.clientX;
    MenuLayer.singleton.pointer.y = event.clientY;
    this.expanded = true;
  }
}

MenuTree.Register();
