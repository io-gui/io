import {html, IoElement} from "../core/element.js";
import {IoMenuLayer} from "./menu-layer.js";
import {IoMenuOptions} from "./menu-options.js";

export class IoMenuItem extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        background: var(--io-background-color);
        padding: var(--io-spacing) 0;
      }
      :host > * {
        padding: 0 var(--io-spacing);
        min-width: 0.5em;
      }
      :host > .io-menu-icon {}
      :host > .io-menu-label {
        flex: 1 1 auto;
      }
      :host > .io-menu-hint {
        opacity: 0.25;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: null,
      label: String,
      icon: String,
      hint: String,
      options: Array,
      position: String,
      $parent: HTMLElement,
      $options: IoMenuOptions,
      tabindex: 1
    };
  }
  static get listeners() {
    return {
      'focus': '_onFocus',
    };
  }
  get $root() {
    let parent = this;
    while (parent && parent.$parent) {
      parent = parent.$parent;
    }
    return parent;
  }
  get optionschain() {
    const chain = [];
    if (this.$options) chain.push(this.$options);
    let parent = this.$parent;
    while (parent) {
      if (parent.localName == 'io-menu-options') chain.push(parent);
      parent = parent.$parent;
    }
    return chain;
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.$options.parentNode) {
      IoMenuLayer.singleton.appendChild(this.$options);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options.parentNode) {
      this.$options.parentNode.removeChild(this.$options);
    }
  }
  _onFocus() {
    if (this.options.length) this.$options.expanded = true;
  }
  changed() {
    this.$options.setProperties({
      $parent: this,
      options: this.options,
      position: this.position
    });
    this.template([
      ['span', {className: 'io-menu-icon'}, this.icon],
      ['span', {className: 'io-menu-label'}, this.label || String(this.value)],
      ['span', {className: 'io-menu-hint'}, this.hint + this.options.length ? '▸' : ''],
    ]);
  }
}

IoMenuItem.Register();
