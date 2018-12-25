import {html, IoElement} from "../core/element.js";

export class IoInspectorBreadcrumbs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 1 0;
        flex-direction: row;
        /* padding: 0.2em;
        background-color: rgba(0, 0, 0, 0.5); */
      }
      :host > io-inspector-link {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host > io-inspector-link:first-of-type,
      :host > io-inspector-link:last-of-type {
        overflow: visible;
        text-overflow: clip;
      }
      :host > io-inspector-link:not(:first-of-type):before {
        content: '/';
        margin: 0 0.2em;
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
