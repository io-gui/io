import {Io} from "../io.js"
import {html} from "../ioutil.js"
import {IoPropertyMixin} from "../ioproperty.js"

export class IoObjectProp extends IoPropertyMixin(Io) {
  static get style() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
        :host > io-number {
          color: rgb(28, 0, 207);
        }
        :host > io-string {
          color: rgb(196, 26, 22);
        }
        :host > io-boolean {
          color: rgb(170, 13, 145);
        }
        :host > io-option {
          color: rgb(32,135,0);
        }
      </style>
    `;
  }
  static get properties() {
    return {
      tag: {
        type: String,
        reflectToAttribute: true
      },
      config: {
        type: Array,
        observer: 'update'
      }
    }
  }
  update() {
    this.tag = this.config.tag;
    this.render([
      [this.config.tag, Object.assign({
          value: this.value[this.key],
          label: this.key,
          listeners: {'value-set': this.setProperty}},
          this.config.props)]
    ]);
  }
}

window.customElements.define('io-object-prop', IoObjectProp);
