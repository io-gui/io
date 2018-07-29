import {html, IoElement} from "../core/element.js";
import {hsvToRgb, rgbToHsv} from "./color.js";

export class IoColorPicker extends IoElement {
  static get style() {
    return html`<style>
      :host {
        background-image: paint(colorpicker);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object
    };
  }
  changed() {
    const hsv = rgbToHsv(this.value);
    const c = hsvToRgb({h: hsv.h, s: 1, v:1});
    this.style.setProperty('--swatch-color', 'rgb(' + c.r * 255 + ',' + c.g * 255 + ',' + c.b * 255 + ')');
  }
}

IoColorPicker.Register();
