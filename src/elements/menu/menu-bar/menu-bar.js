import {Io, html} from "../../../iocore.js";
import {MenuItem} from "../menu-item/menu-item.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";

export class MenuBar extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          white-space: nowrap;
          user-select: none;
        }
        :host > menu-item {
          padding: 0.25em 0.5em;
        }
        :host > menu-item > :not(.menu-label) {
          display: none;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      options: {
        type: Array
      },
      // eliminate expanded property
      expanded: {
        value: true,
        type: Boolean,
        notify: true
      },
      $options: {
        type: Array
      },
      listeners: {
        'menu-item-focused': '_itemFocusedHandler'
      }
    };
  }
  constructor(props) {
    super(props);
    let frag = document.createDocumentFragment();
    for (let i = 0; i < this.options.length; i++) {
      this.$options[i] = new MenuItem({option: this.options[i], $parent: this});
      if (this.$options[i].$group) this.$options[i].$group.position = 'bottom';
      frag.appendChild(this.$options[i]);
    }
    this.appendChild(frag);
  }
  _itemFocusedHandler(event) {
    this._rect = this.getBoundingClientRect();
    if (event.detail.option.options) this.expanded = true;
  }
  _mousemoveHandler(event) {
    MenuLayer.singleton._mousemoveHandler(event);
  }
  connectedCallback() {
    super.connectedCallback();
    MenuLayer.singleton.registerGroup(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    MenuLayer.singleton.unregisterGroup(this);
  }
}

MenuBar.Register();
