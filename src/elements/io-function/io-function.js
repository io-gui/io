import {Io, html} from "../../iocore.js";

export class IoFunction extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: inline-block;
          font-style: italic;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        observer: 'update'
      }
    };
  }
  update() {
    // https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
    let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let ARGUMENT_NAMES = /([^\s,]+)/g;
    let fnStr = this.value.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES) || [];
    this.innerText = 'ƒ(' + result + ')';
  }
}

window.customElements.define('io-function', IoFunction);
