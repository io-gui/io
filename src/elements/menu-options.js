import {html, IoElement} from "../core/element.js";
import {IoMenuLayer} from "./menu-layer.js";

export class IoMenuOptions extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        white-space: nowrap;
        user-select: none;
        touch-action: none;
        background: var(--io-background-color);
        color: var(--io-color);
        padding: var(--io-spacing);
        border-radius: var(--io-border-radius);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        box-shadow: var(--io-shadow);
      }
      :host[horizontal] {
        flex-direction: row;
        align-self: stretch;
      }
      :host[horizontal] > io-menu-item {
        margin: 0 0.5em;
      }
      :host[horizontal] > io-menu-item > .io-menu-hint,
      :host[horizontal] > io-menu-item > .io-menu-more {
        display: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      options: Array,
      expanded: {
        type: Boolean,
        reflect: true
      },
      position: 'right',
      horizontal: {
        type: Boolean,
        reflect: true
      },
      role: 'listbox',
      $parent: HTMLElement
    };
  }
  static get listeners() {
    return {
      'focusin': '_onFocus',
    };
  }
  connectedCallback() {
    super.connectedCallback();
    IoMenuLayer.singleton.registerGroup(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    IoMenuLayer.singleton.unregisterGroup(this);
  }
  optionsChanged() {
    const itemPosition = this.horizontal ? 'bottom' : 'right';
    const options = this.options.map(option => {return (option.label !== undefined || option.value !== undefined) ? option : {value: option};});
    this.template([options.map((elem, i) =>
      ['io-menu-item', {
        $parent: this,
        value: options[i].value,
        label: options[i].label,
        hint: options[i].hint,
        icon: options[i].icon,
        options: options[i].options || [],
        position: itemPosition,
      }]
    )]);
  }
  _onFocus(event) {
    const path = event.composedPath();
    const item = path[0];
    IoMenuLayer.singleton._hoveredGroup = this;
    if (item.localName === 'io-menu-item') {
      IoMenuLayer.singleton._hoveredItem = item;
      if (item.options) this.expanded = true;
    }
  }
}

IoMenuOptions.Register();
