import {html, IoElement} from "../../../io-element.js";

export class ThreeInspectorBreadcrumbs extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex: 0 0 auto;
        flex-direction: row;
        font-size: 0.95em;
        margin: 2px 2px 0 2px;
        padding: 2px;
        border-radius: 6px;
        background: linear-gradient(90deg, #333, #444);
      }
      :host > io-button {
        padding: 2px 4px;
        border-radius: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      :host > io-button:first-of-type,
      :host > io-button:last-of-type {
        overflow: visible;
        text-overflow: clip;
      }
      :host > io-button:not(:first-of-type):before {
        content: '/';
        margin-right: 4px;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object,
      crumbs: Array
    };
  }
  _onSelect(crumb) {
    this.value = crumb.value;
  }
  update() {
    const Prop = (elem) => ['io-button', {
      value: elem,
      label: elem.label,
      action: this._onSelect}];
    this.render([this.crumbs.map(Prop)]);
  }
}

ThreeInspectorBreadcrumbs.Register();
