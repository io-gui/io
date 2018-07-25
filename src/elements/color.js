import {html} from "../core/element.js";
import {IoObject} from "./object.js";

//TODO: test

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
    :host .hex {
      flex: 0 0 auto;
      width: 6em;
    }
    </style>`;
  }
  _onIoObjectMutated(event) {
    super._onIoObjectMutated(event);
    this.changed();
    if (this.$.picker) this.$.picker.changed();
  }
  changed() {

    const r = parseInt(this.value.r * 255);
    const g = parseInt(this.value.g * 255);
    const b = parseInt(this.value.b * 255);
    const a = parseFloat(this.value.a);
    const rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
    const rgba = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';

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
              ['io-label', {label: 'rgba:'}],
              ['io-color-rgba', {value: this.bind('value')}]
            ]],
            ['io-flex-row', [
              ['io-label', {label: 'cmyk:'}],
              ['io-color-cmyk', {value: this.bind('value')}]
            ]],
            ['io-flex-row', [
              ['io-label', {label: 'hsv:'}],
              ['io-color-hsv', {value: this.bind('value')}]
            ]],
            ['io-flex-row', [
              ['io-label', {label: 'hex:'}],
              ['io-color-hex', {value: (( this.value.r * 255 ) << 16 ^ ( this.value.g * 255 ) << 8 ^ ( this.value.b * 255 ) << 0), hex: true, step: 1, className: 'hex'}]
            ]]
          ]]
        ]]
      ]]
    ]);

    } else {

      this.template([
        ['io-flex-row', [
          ['io-boolean', {true: '▾', false: '▸', value: this.bind('expanded'), id: 'swatch'}],
          ['io-color-rgba', {value: this.bind('value')}]
        ]]
      ]);

    }

    this.$.swatch.style.setProperty('--swatch-color', isNaN(a) ? rgb : rgba);

  }
}

IoColor.Register();
