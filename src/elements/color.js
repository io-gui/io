import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test

export function rgbToHsv(rgb) {
  const max = Math.max(rgb.r, rgb.g, rgb.b), min = Math.min(rgb.r, rgb.g, rgb.b);
  const d = max - min;
  let h, s, v = max;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0;
  } else {
    switch (max) {
      case rgb.r: h = (rgb.g - rgb.b) / d + (rgb.g < rgb.b ? 6 : 0); break;
      case rgb.g: h = (rgb.b - rgb.r) / d + 2; break;
      case rgb.b: h = (rgb.r - rgb.g) / d + 4; break;
    }
    h /= 6;
  }
  return {h: h, s: s, v: v};
}

export function hsvToRgb(hsv) {
  let r, g, b;
  const h = hsv.h;
  const s = hsv.s;
  const v = hsv.v;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {r: r, g: g, b: b};
}

export class IoColor extends IoObject {
  static get style() {
    return html`<style>
    :host io-boolean,
    :host io-boolean:hover {
      padding-left: 0.25em;
      background-image: paint(swatch);
      flex: 1 1;
    }
    :host io-color-picker {
      flex: 0 0 auto;
      width: 5em;
    }
    :host io-label {
      flex: 0 0 auto;
      width: 3em;
      text-align: right;
    }
    :host io-color-rgb,
    :host io-color-hsv {
      flex: 0 0 auto;
      width: 9em;
    }
    :host io-color-rgba,
    :host io-color-cmyk {
      flex: 0 0 auto;
      width: 12em;
    }
    :host io-color-hex {
      flex: 0 0 auto;
    }
    </style>`;
  }
  _onIoObjectMutated(event) {
    if (event.detail.object === this.value) {
      this.changed();
      if (this.$.picker) this.$.picker.changed();
    }
  }
  changed() {
    const r = parseInt(this.value.r * 255);
    const g = parseInt(this.value.g * 255);
    const b = parseInt(this.value.b * 255);
    if (this.expanded) {
      this.template([
        ['io-flex-column', [
        ['io-boolean', {true: '▾', false: '▸', value: this.bind('expanded'), id: 'swatch'}],
        ['io-flex-row', [
          ['io-color-picker', {value: this.value, id: 'picker'}],
          ['io-flex-column', [
            ['io-flex-row', [
              ['io-label', {label: 'rgb:'}],
              ['io-color-rgb', {value: this.bind('value')}]
            ]],
            ['io-flex-row', [
              ['io-label', {label: 'hsv:'}],
              ['io-color-hsv', {value: rgbToHsv(this.value), 'on-value-set': this.hsvChanged}]
            ]],
            ['io-flex-row', [
              ['io-label', {label: 'hex:'}],
              ['io-color-hex', {value: (r << 16 ^ g << 8 ^ b << 0), 'on-value-set': this.hexChanged}]
            ]]
          ]]
        ]]
      ]]
    ]);
    } else {
      this.template([
        ['io-flex-row', [
          ['io-boolean', {true: '▾', false: '▸', value: this.bind('expanded'), id: 'swatch'}],
          ['io-color-rgb', {value: this.bind('value')}]
        ]]
      ]);
    }
    this.$.swatch.style.setProperty('--swatch-color', 'rgb(' + r + ',' + g + ',' + b + ')');
  }
  hexChanged(event) {
    event.stopPropagation();
    this.value.r = (event.detail.value >> 16 & 255) / 255;
    this.value.g = (event.detail.value >> 8 & 255) / 255;
    this.value.b = (event.detail.value & 255) / 255;
    this.dispatchEvent('io-object-mutated', {object: this.value, key: '*'}, false, window);
  }
  hsvChanged(event) {
    event.stopPropagation();
    const rgb = hsvToRgb(arguments[0].detail.object);
    this.value.r = rgb.r;
    this.value.g = rgb.g;
    this.value.b = rgb.b;
    this.dispatchEvent('io-object-mutated', {object: this.value, key: '*'}, false, window);
  }
}

IoColor.Register();
