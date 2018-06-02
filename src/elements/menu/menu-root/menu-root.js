import {IoElement}from "../../../io-element.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";
import {MenuGroup} from "../menu-group/menu-group.js";

const _stagingElement = document.createElement('div');

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative?
export class MenuRoot extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      listener: 'click'
    };
  }
  constructor(props) {
    super(props);
    // BUG: bindings dont work in io-option sor some reason
    this.render([
      ['menu-group', {
        id: 'group',
        $parent: this,
        options: this.bind('options'),
        position: this.bind('position'),
        expanded: this.bind('expanded')
      }]
    ], _stagingElement);
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this._parent.addEventListener(this.listener, this._onExpand);
    MenuLayer.singleton.appendChild(this.$['group']);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener(this.listener, this._onExpand);
    MenuLayer.singleton.removeChild(this.$['group']);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onExpand(event) {
    event.preventDefault();
    let evt = event.touches ? event.touches[0] : event;
    MenuLayer.singleton.collapseAllGroups();
    MenuLayer.singleton._x = evt.clientX;
    MenuLayer.singleton._y = evt.clientY;
    this.expanded = true;
  }
}

MenuRoot.Register();
