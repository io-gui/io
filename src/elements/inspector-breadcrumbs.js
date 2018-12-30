import {html, IoElement} from "../core/element.js";

export class IoInspectorBreadcrumbs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 1 0;
        flex-direction: row;
        padding: 0 0.25em;
        background: #fff;
        border: 1px solid #999;
        border-radius: 2px;
      }
      :host > io-inspector-link {
        border: none;
        overflow: hidden;
        text-overflow: ellipsis;
        background: none;
        padding: 0;
      }
      :host > io-inspector-link:first-of-type,
      :host > io-inspector-link:last-of-type {
        overflow: visible;
        text-overflow: clip;
      }
      :host > io-inspector-link:not(:first-of-type):before {
        content: '/';
        margin: 0 0.1em;
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
