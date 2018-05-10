import {Io, html} from "../../../iocore.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuGroup} from "../menu-group/menu-group.js";

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative? 

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
    MenuLayer.singleton.appendChild(this.$group);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener(this.listener, this._expandHandler);
    MenuLayer.singleton.removeChild(this.$group);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _expandHandler(event) {
    event.preventDefault();
    let evt = event.touches ? event.touches[0] : event;
    MenuLayer.singleton.collapseAllGroups();
    MenuLayer.singleton._x = evt.clientX;
    MenuLayer.singleton._y = evt.clientY;
    this.expanded = true;
  }
}

MenuRoot.Register();
