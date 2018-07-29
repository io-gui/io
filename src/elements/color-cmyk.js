import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test

export class IoColorCmyk extends IoObject {
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

    const r = parseInt(this.value.r * 255);
    const g = parseInt(this.value.g * 255);
    const b = parseInt(this.value.b * 255);
    const a = parseFloat(this.value.a);
    const rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

    this.template([
      ['io-number', {value: this.value.r, id: 'c', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#00ffff'}}],
      ['io-number', {value: this.value.g, id: 'm', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#ff00ff'}}],
      ['io-number', {value: this.value.b, id: 'y', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#ffff00'}}],
      ['io-number', {value: this.value.a, id: 'k', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#000000'}}]
    ]);

  }
}

IoColorCmyk.Register();
