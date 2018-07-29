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
    this.template([
      ['io-number', {value: this.value.c, id: 'c', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#00ffff'}}],
      ['io-number', {value: this.value.m, id: 'm', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#ff00ff'}}],
      ['io-number', {value: this.value.y, id: 'y', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#ffff00'}}],
      ['io-number', {value: this.value.k, id: 'k', step: 0.01, min: 0, max: 1, strict: false, underslider: true, style: {'--slider-color': '#000000'}}]
    ]);

  }
}

IoColorCmyk.Register();
