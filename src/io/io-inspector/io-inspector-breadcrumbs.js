import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {UiButton} from "../../ui/ui-button/ui-button.js"

function isPropertyOf(prop, object) {
  for (var p in object) if (object[p] === prop) return true;
  return false;
}

export class IoInspectorBreadcrumbs extends Io {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          font-weight: bold;
          font-size: 1.1em;
          padding: 0.2em;
          border-radius: 0.1em;
          white-space: nowrap;
        }
        :host .io-back-button {
          background: #333;
          border-radius: 0.2em;
          padding: 0.2em 0.4em;
          margin-left: 0.2em;
          cursor: pointer;
          white-space: nowrap;
        }
        :host .io-flex {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        :host .io-breadcrumb {
          padding: 0.2em 0;
          margin: 0 0.2em;
          cursor: pointer;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :host .io-breadcrumb:last-of-type {
          overflow: visible;
          text-overflow: clip;
        }
        :host .io-breadcrumb:before {
          content: '/';
          margin-right: 0.2em;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Object,
        observer: 'update'
      },
      path: {
        type: Array,
        value: []
      }
    }
  }
  _backHandler() {
    this.value = this.path[Math.max(0, this.path.length - 2)];
  }
  _gotoHandler(i) {
    this.value = this.path[i];
  }
  update() {
    if (this.path.indexOf(this.value) !== -1) {
      this.path.length = this.path.indexOf(this.value) + 1;
    } else if (this.path.length && isPropertyOf(this.value, this.path[this.path.length - 1])) {
      this.path.push(this.value);
    } else if (this.path.indexOf(this.value) === -1) {
      this.path = [this.value];
    }
    const Prop = (elem, i) => ['ui-button',
        {class: 'io-breadcrumb', action: this._gotoHandler, value: i}, this.path[i].__proto__.constructor.name];
    this.render([
      ['div', {class: 'io-flex'}, [
        this.path.map(Prop),
      ]],
      this.path.length > 1 ? ['ui-button', {class: 'io-back-button', action: this._backHandlerm, label: '< Back'}] : null
    ]);
  }
}


window.customElements.define('io-inspector-breadcrumbs', IoInspectorBreadcrumbs);
