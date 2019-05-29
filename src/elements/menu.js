import {IoElement} from "../core/element.js";
import {IoMenuLayer} from "./menu-layer.js";

const selection = window.getSelection();

// TODO: implement working mousestart/touchstart UX
// TODO: implement keyboard modifiers maybe. Touch alternative?
export class IoMenu extends IoElement {
  static get properties() {
    return {
      options: Array,
      expanded: Boolean,
      position: 'pointer',
      button: 0,
    };
  }
  constructor(props) {
    super(props);
    this.template([
      ['io-menu-options', {
        id: 'group',
        $parent: this,
        options: this.bind('options'),
        position: this.bind('position'),
        expanded: this.bind('expanded')
      }]
    ]);
    this.$.group.__parent = this;
  }
  connectedCallback() {
    super.connectedCallback();
    this._parent = this.parentElement;
    this._parent.addEventListener('mousedown', this._onMousedown);
    this._parent.addEventListener('touchstart', this._onTouchstart);
    this._parent.addEventListener('contextmenu', this._onContextmenu);
    IoMenuLayer.singleton.appendChild(this.$['group']);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._parent.removeEventListener('mousedown', this._onMousedown);
    this._parent.removeEventListener('touchstart', this._onTouchstart);
    this._parent.removeEventListener('touchmove', this._onTouchmove);
    this._parent.removeEventListener('touchend', this._onTouchend);
    this._parent.removeEventListener('contextmenu', this._onContextmenu);
    // TODO: unhack
    // if (this.$['group']) IoMenuLayer.singleton.removeChild(this.$['group']);
    // https://github.com/arodic/io/issues/1
    for (let i = 0; i < IoMenuLayer.singleton.children.length; i++) {
      if (IoMenuLayer.singleton.children[i].__parent === this) {
        IoMenuLayer.singleton.removeChild(IoMenuLayer.singleton.children[i]);
        return;
      }
    }
  }
  getBoundingClientRect() {
    return this._parent.getBoundingClientRect();
  }
  _onContextmenu(event) {
    if (this.button === 2) {
      event.preventDefault();
      this.open(event);
    }
  }
  _onMousedown(event) {
    if (event.button === this.button && this.button !== 2) {
      this.open(event);
      IoMenuLayer.singleton._onMousemove(event);
    }
  }
  _onTouchstart(event) {
    event.preventDefault();
    this._parent.addEventListener('touchmove', this._onTouchmove);
    this._parent.addEventListener('touchend', this._onTouchend);
    this.open(event.changedTouches[0]);
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchmove(event) {
    IoMenuLayer.singleton._onTouchmove(event);
  }
  _onTouchend(event) {
    this._parent.removeEventListener('touchmove', this._onTouchmove);
    this._parent.removeEventListener('touchend', this._onTouchend);
    IoMenuLayer.singleton._onTouchend(event);
  }
  open(event) {
    selection.removeAllRanges();
    IoMenuLayer.singleton.collapseAllGroups();
    IoMenuLayer.singleton._x = event.clientX;
    IoMenuLayer.singleton._y = event.clientY;
    this.expanded = true;
  }
}

IoMenu.Register();
