import {IoMathLayer} from "./math-layer.js";
import {IoHsvaPicker} from "./hsva-picker.js";
import {rgb2hsv, hsv2rgb} from "./utils.js";

export class IoRgbaPicker extends IoHsvaPicker {
  valueChanged() {
    this._c = this.value instanceof Array ? [0, 1, 2, 3] : ['r', 'g', 'b', 'a'];
  }
  _onValueSet(event) {
    const c = this._c;
    const hsva = event.detail.value;
    const rgb = hsv2rgb(hsva[0], hsva[1], hsva[2]);
    this.value[c[0]] = rgb[0];
    this.value[c[1]] = rgb[1];
    this.value[c[2]] = rgb[2];
    if (this.value[c[3]] !== undefined) this.value[c[3]] = hsva[3];
    this._suspendLoop = true;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    setTimeout(()=> {
      this._suspendLoop = false;
    });
  }
  changed() {
    if (this._suspendLoop) return;
    const c = this._c;
    const hsv = rgb2hsv(this.value[c[0]], this.value[c[1]], this.value[c[2]]);
    this._hsva = [...hsv, this.value[c[3]] || 1];
    const hasAlpha = this.value[c[3]] !== undefined;
    this.template([
      ['io-hsva-sv', {value: this._hsva, 'on-value-set': this._onValueSet}],
      ['io-hsva-hue', {value: this._hsva, horizontal: !this.horizontal, 'on-value-set': this._onValueSet}],
      hasAlpha ? ['io-hsva-alpha', {value: this._hsva, horizontal: !this.horizontal, 'on-value-set': this._onValueSet}] : null,
    ]);
  }
}

IoRgbaPicker.Register();

IoRgbaPicker.singleton = new IoRgbaPicker();
IoMathLayer.singleton.appendChild(IoRgbaPicker.singleton);
IoRgbaPicker.singleton.addEventListener('expanded-changed', IoMathLayer.singleton.onChildExpanded);
