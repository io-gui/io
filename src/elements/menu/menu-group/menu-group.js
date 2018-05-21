import {Io} from "../../../iocore.js";
import {MenuItem} from "../menu-item/menu-item.js";
import {MenuLayer} from "../menu-layer/menu-layer.js";

export class MenuGroup extends Io {
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
      :host:not([indocument]) {
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
      :host[indocument] {
        display: flex;
      }
      :host[indocument] > menu-item {
        padding: 0.25em 0.5em;
      }
      :host[indocument] > menu-item > :not(.menu-label) {
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
      indocument: {
        type: Boolean,
        reflect: true
      },
      $parent: HTMLElement
    };
  }
  static get listeners() {
    return {
      'focusin': '_onFocus'
    }
  }
  update() {
    const Item = (elem, i) => ['menu-item', {
      $parent: this,
      option: this.options[i],
      position: this.horizontal ? 'bottom' : 'right'
    }];
    this.render([this.options.map(Item)]);
  }
  connectedCallback() {
    super.connectedCallback();
    this.indocument = this.parentNode !== MenuLayer.singleton;
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
