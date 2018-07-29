import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test

export class IoColorHsv extends IoObject {
  static get style() {
    return html`<style>
    :host {
      display: flex;
      flex-direction: row;
    }
    :host > io-number {
      flex: 1 1;
    }
    </style>`;
  }
  changed() {

    this.template([
      ['io-number', {value: this.value.h, 'on-value-set': this._onValueSet, id: 'h', step: 0.01, min: 0, max: 1, strict: false, underslider: true}],
      ['io-number', {value: this.value.s, 'on-value-set': this._onValueSet, id: 's', step: 0.01, min: 0, max: 1, strict: false, underslider: true}],
      ['io-number', {value: this.value.v, 'on-value-set': this._onValueSet, id: 'v', step: 0.01, min: 0, max: 1, strict: false, underslider: true}]
    ]);

  }
}

IoColorHsv.Register();
