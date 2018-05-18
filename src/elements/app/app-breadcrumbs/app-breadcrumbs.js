import {Io, html} from "../../../iocore.js";
import {IoButton} from "../../io/io-button/io-button.js";

export class AppBreadcrumbs extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          font-size: 1.1em;
          padding: 0.2em;
          border-radius: 0.1em;
          white-space: nowrap;
        }
        :host > io-button {
          padding: 0.2em 0;
          margin: 0 0.2em;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :host > io-button:last-of-type {
          overflow: visible;
          text-overflow: clip;
        }
        :host > io-button:before {
          content: '/';
          margin-right: 0.4em;
        }
      </style>
    `;
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
    const Prop = (elem, i) => ['io-button', {
      value: elem,
      label: elem.label,
      action: this._onSelect}];
    this.render([this.crumbs.map(Prop)]);
  }
}

AppBreadcrumbs.Register();
