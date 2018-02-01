import {html} from "../ioutil.js"
import {Io} from "../io.js"
import {IoCollapsable} from "../io-collapsable/io-collapsable.js"
import {IoObjectProperty} from "../io-object/io-object-prop.js"

export class IoInspectorProp extends IoObjectProperty {
  static get style() {
    return html`
      <style>
        :host > io-boolean {
          color: #9c8;
        }
        :host > io-string,
        :host > io-number {
          display: block;
          color: #bef;
          background: #555;
          border-radius: 2px;
          margin: 1px;
        }
        :host > io-vector > io-object-prop > io-number,
        :host > io-color > io-object-prop > io-number,
        :host > io-color > div {
          color: #bef;
          background: #555;
          border-radius: 2px;
          margin: 1px;
        }
      </style>
    `;
  }
  _update() {
    // console.log(this.value[this.key])
    // this.render([
    //   ['div', this.config.tag + this.value[this.key]]
    // ]);
    this.render([
      [this.config.tag, Object.assign({value: this.value[this.key], label: this.config.tag !== 'io-object' ? this.key : null, listeners: {'value-set': this._valueSetHandler}}, this.config.props) ]
    ]);
  }
}


window.customElements.define('io-inspector-prop', IoInspectorProp);
