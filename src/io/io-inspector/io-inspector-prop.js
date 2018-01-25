import {html, iftrue} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
import {IoObjectProperty} from "../io-object/io-object-property.js"

export class IoInspectorProp extends IoObjectProperty {
  static get is() { return 'io-inspector-prop'; }
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          background: rgba(128,0,32,0.2);
        }
        ::slotted(.io-link),
        ::slotted(.io-label) {
          display: inline-block;
          width: 8em;
          text-align: right;
          background: rgba(128,0,32,0.2);
          overflow: hidden;
          text-overflow: ellipsis;
        }
        ::slotted(.io-link) {
          color: blue;
          text-decoration: underline;
        }
      </style>
    `;
  }
  _update() {
    let isObject = typeof this.value[this.key] === 'object' && this.value[this.key] !== null;
    this.render([
      ['span', {className: isObject ? 'io-link' : 'io-label'}, this.key],
      iftrue(this.config.tag !== 'io-object', [this.config.tag, Object.assign({value: this.value[this.key], label: this.key}, this.config.props) ])
    ]);
  }
}


window.customElements.define(IoInspectorProp.is, IoInspectorProp);
