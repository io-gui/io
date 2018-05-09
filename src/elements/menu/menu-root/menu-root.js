import {Io, html} from "../../../iocore.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuGroup} from "../menu-group/menu-group.js";

export class MenuRoot extends Io {
  static get properties() {
    return {
      options: {
        type: Array
      },
      expanded: {
        type: Boolean
      },
      position: {
        value: 'pointer',
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
    this._parent = this.parentElement;
    this._parent.addEventListener(this.listener, this._expandHandler);
    MenuLayer.singleton.registerGroup(this.$group);
    MenuLayer.singleton.appendChild(this.$group);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener(this.listener, this._expandHandler);
    MenuLayer.singleton.removeChild(this.$group);
    MenuLayer.singleton.unregisterGroup(this.$group);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _expandHandler(event) {
    event.preventDefault();
    MenuLayer.singleton.collapseGroups();
    MenuLayer.singleton.pointer.x = event.clientX;
    MenuLayer.singleton.pointer.y = event.clientY;
    this.expanded = true;
  }
}

MenuRoot.Register();
