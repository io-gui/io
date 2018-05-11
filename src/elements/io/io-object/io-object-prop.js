import {Io, html} from "../../../iocore.js";
import {IoPropertyMixin} from "../../../mixins/ioproperty.js";

export class IoObjectProp extends IoPropertyMixin(Io) {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          padding-left: 1em;
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
      config: Array
    };
  }
  update() {
    this.render([
      ['span', this.key + ':'],
      [this.config.tag, Object.assign({
          value: this.value[this.key],
          label: this.key,
          listeners: {'value-set': this.setProperty}},
          this.config.props)]
    ]);
  }
}

IoObjectProp.Register();
