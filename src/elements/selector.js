import {html, IoElement} from "../io-core.js";
import "./tabs.js";
import "./element-cache.js";

export class IoSelector extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: relative;
      }
      :host[vertical] {
        flex-direction: row;
      }
      :host > io-tabs {
        z-index: 2;
      }
      :host:not([vertical]) > io-tabs {
        margin: 0 var(--io-theme-spacing);
        margin-bottom: -1px;
      }
      :host[vertical] > io-tabs {
        flex: 0 0 auto;
        margin: var(--io-theme-spacing) 0;
        margin-right: -1px;
      }
      :host[vertical] > io-tabs > io-button,
      :host[vertical] > io-tabs > io-button.io-selected {
        align-self: flex-end;
        color: var(--io-theme-link-color);
        border: none;
        background: none;
        background-image: none !important;
      }
      :host[vertical] > io-tabs > io-button:hover {
        text-decoration: underline;
      }
      :host > io-element-cache {
        flex: 1 1 auto;
        padding: var(--io-theme-padding);
        border: var(--io-theme-content-border);
        border-radius: var(--io-theme-border-radius);
        background: var(--io-theme-content-bg);
        overflow: auto;
      }
    </style>`;
  }
  static get properties() {
    return {
      elements: Array,
      selected: Number,
      precache: Boolean,
      cache: true,
      collapseWidth: 500,
      vertical: {
        type: Boolean,
        reflect: true
      },
      collapsed: {
        type: Boolean,
        reflect: true
      },
    };
  }
  resized() {
    const rect = this.getBoundingClientRect();
    this.collapsed = this.vertical && rect.width < this.collapseWidth;
  }
  changed() {
    const options = [];
    for (let i = 0; i < this.elements.length; i++) {
      const props = this.elements[i][1] || {};
      const label = props.label || props.title || props.name || this.elements[i][0] + '[' + i + ']';
      options.push({
        value: i,
        label: label,
      });
    }
    this.template([
      ['io-tabs', {
        selected: this.bind('selected'),
        vertical: this.vertical,
        collapsed: this.collapsed,
        options: options,
      }],
      ['io-element-cache', {
        elements: this.elements,
        selected: this.selected,
        cache: this.cache,
        precache: this.precache,
      }],
    ]);
  }
}

IoSelector.Register();
