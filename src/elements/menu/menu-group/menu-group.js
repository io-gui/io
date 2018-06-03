import {html, IoElement} from "../../../io-element.js";
import "../menu-item/menu-item.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";

export class MenuGroup extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: none;
        flex-direction: column;
        white-space: nowrap;
        user-select: none;
      }
      :host[horizontal] {
        flex-direction: row;
      }
      :host:not([nested]) {
        background: white;
        padding: 0.125em 0 0.25em 0;
        border: 1px solid #666;
        box-shadow: 1px 1px 2px rgba(0,0,0,0.33);
        position: absolute;
        transform: translateZ(0);
        top: 0;
        left: 0;
        min-width: 6em;
      }
      :host[expanded],
      :host[nested] {
        display: flex;
      }
      :host[nested] > menu-item {
        padding: 0.25em 0.5em;
      }
      :host[nested] > menu-item > :not(.menu-label) {
        display: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      expanded: {
        type: Boolean,
        notify: true,
        reflect: true
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: true
      },
      nested: {
        type: Boolean,
        reflect: true
      },
      $parent: HTMLElement
    };
  }
  static get listeners() {
    return {
      'focusin': '_onFocus'
    };
  }
  update() {
    const Item = (elem, i) => ['menu-item', {
      $parent: this,
      option: typeof this.options[i] === 'object' ? this.options[i] : {value: this.options[i], label: this.options[i]},
      position: this.horizontal ? 'bottom' : 'right'
    }];
    this.render([this.options.map(Item)]);
  }
  connectedCallback() {
    super.connectedCallback();
    this.nested = this.parentNode !== MenuLayer.singleton;
    MenuLayer.singleton.registerGroup(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    MenuLayer.singleton.unregisterGroup(this);
  }
  _onFocus(event) {
    let item = event.path[0];
    MenuLayer.singleton._hoveredGroup = this;
    if (item.localName === 'menu-item') {
      MenuLayer.singleton._hoveredItem = item;
      if (item.option.options) this.expanded = true;
    }
  }
}

MenuGroup.Register();
