import {IoLayerSingleton} from "../../io-elements-core.js";
import {IoHsvaPicker} from "./hsva-picker.js";
import {convert} from "../../../lib/color-convert.js";


export class IoRgbaPicker extends IoHsvaPicker {
  valueChanged() {
    this.components = this.value instanceof Array ? [0, 1, 2, 3] : ['r', 'g', 'b', 'a'];
  }
  _onValueSet(event) {
    const c = this.components;
    const hsva = event.detail.value;
    const rgb = convert.hsv.rgb(
      hsva[0] * 360,
      hsva[1] * 100,
      hsva[2] * 100
    );
    const hasAlpha = this.value[c[3]] !== undefined;
    this.value[c[0]] = rgb[0] / 255;
    this.value[c[1]] = rgb[1] / 255;
    this.value[c[2]] = rgb[2] / 255;
    if (hasAlpha) this.value[c[3]] = hsva[3];
    this._suspendLoop = true;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    setTimeout(()=> {
      this._suspendLoop = false;
    });
  }
  changed() {
    if (this._suspendLoop) return;
    const c = this.components;
    const hsv = convert.rgb.hsv(
      this.value[c[0]] * 255,
      this.value[c[1]] * 255,
      this.value[c[2]] * 255
    );
    const hasAlpha = this.value[c[3]] !== undefined;
    this._hsva = [
      hsv[0] / 360,
      hsv[1] / 100,
      hsv[2] / 100,
      hasAlpha ? this.value[c[3]] : 1];
    this.template([
      ['io-color-slider-sv', {value: this._hsva, 'on-value-set': this._onValueSet}],
      ['io-color-slider-hue', {value: this._hsva, horizontal: !this.horizontal, 'on-value-set': this._onValueSet}],
      hasAlpha ? ['io-color-slider-alpha', {value: this._hsva, horizontal: !this.horizontal, 'on-value-set': this._onValueSet}] : null,
    ]);
  }
}

IoRgbaPicker.Register();

IoRgbaPicker.singleton = new IoRgbaPicker();
IoLayerSingleton.appendChild(IoRgbaPicker.singleton);
IoRgbaPicker.singleton.addEventListener('expanded-changed', IoLayerSingleton.onChildExpanded);
