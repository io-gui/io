import {html, IoElement} from "../io-core.js";

export class IoInspectorBreadcrumbs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 1 0;
        flex-direction: row;
        padding: 0.5em 0.75em;
        margin: 2px;
        background: #fff;
        border: 1px solid #999;
        border-radius: 2px;
        font-size: 0.75em;
      }
      :host > io-inspector-link {
        border: none;
        overflow: hidden;
        text-overflow: ellipsis;
        background: none;
        padding: 0;
      }
      :host > io-inspector-link:first-of-type {
        color: #000;
      }
      :host > io-inspector-link:first-of-type,
      :host > io-inspector-link:last-of-type {
        overflow: visible;
        text-overflow: clip;
      }
      :host > io-inspector-link:not(:first-of-type):before {
        content: '>';
        margin: 0 0.5em;
        opacity: 0.25;
      }
    </style>`;
  }
  static get properties() {
    return {
      crumbs: Array,
    };
  }
  changed() {
    this.template([this.crumbs.map(i => ['io-inspector-link', {value: i}])]);
  }
}

IoInspectorBreadcrumbs.Register();
