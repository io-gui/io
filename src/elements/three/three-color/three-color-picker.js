import {Io, html} from "../../../iocore.js";
import {IoPropertyMixin} from "../../../mixins/ioproperty.js";

export class ThreeColorPicker extends IoPropertyMixin(Io) {
  static get style() {
    return html`
      <style>
        :host {
          display: flex;
          flex-direction: row;
          min-width: 1.22em;
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: Object,
      key: '*'
    };
  }
  update() {
    let r = parseInt(this.value.r * 255);
    let g = parseInt(this.value.g * 255);
    let b = parseInt(this.value.b * 255);
    this.style.backgroundColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    this.innerHTML = '&nbsp;';
  }
}

ThreeColorPicker.Register();
