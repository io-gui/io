import {IoElement} from "../core.js";
import {IoMenuLayer} from "./menu-layer.js";

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative?
export class IoMenu extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      listener: 'click'
    };
  }
  static get listeners() {
    return {
      'options-changed': 'onOptionsChanged'
    };
  }
  constructor(props) {
    super(props);
    this.render([
      ['io-menu-group', {
        id: 'group',
        $parent: this,
        options: this.bind('options'),
        position: this.bind('position'),
        expanded: this.bind('expanded')
      }]
    ]);
    this.$.group.__parent = this;
  }
  onOptionsChanged() {
    console.log(this, this.options === this.$.group.options, this.options);
    // if (this.debug) console.log(this.$.group.__props.options.binding);
    // if (this.debug) console.log(this.$.group.__props.options.binding.source === this);
    // if (this.debug) console.log(this.$.group.__props.options.binding.targets[0] === this.$.group);
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this._parent.addEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.appendChild(this.$['group']);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener(this.listener, this._onExpand);
    IoMenuLayer.singleton.removeChild(this.$['group']);
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onExpand(event) {
    event.preventDefault();
    let evt = event.touches ? event.touches[0] : event;
    IoMenuLayer.singleton.collapseAllGroups();
    IoMenuLayer.singleton._x = evt.clientX;
    IoMenuLayer.singleton._y = evt.clientY;
    this.expanded = true;
  }
}

IoMenu.Register();
