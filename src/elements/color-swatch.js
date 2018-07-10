import {html, IoElement} from "../core/element.js";

export class IoColorSwatch extends IoElement {
  static get style() {
    return html`<style>
      :host {
        background-image: paint(swatch);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Object
    };
  }
  changed() {
    const r = parseInt(this.value.r * 255);
    const g = parseInt(this.value.g * 255);
    const b = parseInt(this.value.b * 255);
    const a = parseFloat(this.value.a);
    if (isNaN(a)) {
      this.style.setProperty('--swatch-color', 'rgb(' + r + ',' + g + ',' + b + ')');
    } else {
      this.style.setProperty('--swatch-color', 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
    }
  }
}

IoColorSwatch.Register();
