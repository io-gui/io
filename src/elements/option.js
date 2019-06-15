import {html} from "../core/element.js";
import {IoButton} from "./button.js";
import {IoMenuOptions} from "./menu-options.js";
import {IoMenuLayer} from "./menu-layer.js";

export class IoOption extends IoButton {
  static get style() {
    return html`<style>
      :host {
        padding: var(--io-padding) calc(1.5 * var(--io-padding));
      }
      :host:not([label])::before {
        content: '▾';
        padding-right: var(--io-padding);
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      label: '',
      expanded: Boolean,
      _option: Object,
      _menu: IoMenuOptions,
    };
  }
  static get listeners() {
    return {
      'menu-item-clicked': '_onMenu',
      'mousedown': '_onMousedown',
      // 'touchend': '_onTouchend',
    };
  }
  constructor(props) {
    super(props);
    this._menu.setProperties({
      $parent: this,
      expanded: this.bind('expanded'),
      position: 'bottom',
    });
  }
  connectedCallback() {
    super.connectedCallback();
    IoMenuLayer.singleton.appendChild(this._menu);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoMenuLayer.singleton.removeChild(this._menu);
  }
  _onClick() {
    // this.expanded = true;
  }
  // _onTouchend() {
  // }
  _onMousedown() {
    this.expanded = true;
  }
  _onKeydown(event) {
    if (this.expanded && event.which === 27) {
      event.preventDefault();
      this.expanded = false;
    } else if (this.expanded && [39, 40].indexOf(event.which) !== -1) {
      event.preventDefault();
      if (this._menu.firstChild) this._menu.firstChild.focus();
    } else if (this.expanded && event.which === 38) {
      event.preventDefault();
      if (this._menu.lastChild) this._menu.lastChild.focus();
    } else if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      this.expanded = !this.expanded;
    } else if (event.which == 37) {
      event.preventDefault();
      this.focusTo('left');
    } else if (event.which == 38) {
      event.preventDefault();
      this.focusTo('up');
    } else if (event.which == 39) {
      event.preventDefault();
      this.focusTo('right');
    } else if (event.which == 40) {
      event.preventDefault();
      this.focusTo('down');
    }
  }
  _onMenu(event) {
    this.set('value', event.detail.value);
  }
  changed() {
    const options = this.options.map(option => {return (option.label !== undefined || option.value !== undefined) ? option : {value: option};});
    this._option = options.find(option => {return option.value === this.value;});
    let label = this.label || (this._option ? (this._option.label || this._option.value) : this.value);
    label = (label instanceof Object) ? label.__proto__.constructor.name : String(label);

    this._menu.options = options;

    this.title = label;
    this.innerText = label;

    this.setAttribute('aria-haspopup', 'listbox');
    this.setAttribute('aria-expanded', String(this.expanded));
  }
}

IoOption.Register();
