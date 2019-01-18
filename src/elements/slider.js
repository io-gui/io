import {html, IoElement, IoCore} from "../io-core.js";

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

export class IoSlider extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        flex-direction: row;
      }
      :host > io-number {
        flex: 0 0 auto;
      }
      :host > io-slider-knob {
        flex: 1 1 auto;
        margin-left: 2px;
        border: 1px solid #000;
        border-radius: 2px;
        padding: 0 1px;
        background: #999;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.001,
      min: 0,
      max: 1,
      strict: true,
    };
  }
  _onValueSet(event) {
    this.dispatchEvent('value-set', event.detail, false);
  }
  changed() {
    const charLength = (Math.max(Math.max(String(this.min).length, String(this.max).length), String(this.step).length));
    this.template([
      ['io-number', {value: this.bind('value'), step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'number', 'on-value-set': this._onValueSet}],
      ['io-slider-knob', {value: this.bind('value'), step: this.step, min: this.min, max: this.max, strict: this.strict, id: 'slider', 'on-value-set': this._onValueSet}]
    ]);
    this.$.number.style.setProperty('min-width', charLength + 'em');
  }
}

IoSlider.Register();

export class IoSliderKnob extends IoElement {
  static get style() {
    return html`<style>
      :host {
        display: flex;
        cursor: ew-resize;
        overflow: hidden;
      }
      :host img {
        width: 100% !important;
        touch-action: none;
        user-select: none;
      }
    </style>`;
  }
  static get properties() {
    return {
      value: 0,
      step: 0.01,
      min: 0,
      max: 1000,
      strics: true, // TODO: implement
      pointermode: 'absolute',
      cursor: 'ew-resize'
    };
  }
  static get listeners() {
    return {
      'pointermove': 'onPointermove',
    };
  }
  onPointermove(event) {
    if (event.buttons !== 0) {
      this.setPointerCapture(event.pointerId);
      event.preventDefault();
      const rect = this.getBoundingClientRect();
      const x = (event.clientX - rect.x) / rect.width;
      const pos = Math.max(0,Math.min(1, x));
      let value = this.min + (this.max - this.min) * pos;
      value = Math.round(value / this.step) * this.step;
      value = Math.min(this.max, Math.max(this.min, (Math.round(value / this.step) * this.step)));
      this.set('value', value);
    }
  }
  changed() {
    this.template([['img', {id: 'img'}],]);
    this.$.img.src = this.paint(this.$.img.getBoundingClientRect());
  }

  paint(rect) {
    // TODO: implement in webgl shader
    canvas.width = rect.width;
    canvas.height = rect.height;

    const bgColor = '#444';
    const colorStart = '#2cf';
    const colorEnd = '#2f6';
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const value = this.value;

    if (isNaN(value)) return;

    const w = rect.width, h = rect.height;
    const handleWidth = 4;

    let snap = Math.floor(min / step) * step;
    let pos;

    if (((max - min) / step) < w / 3 ) {
      while (snap < (max - step * 2)) {
        snap += step;
        pos = Math.floor(w * (snap - min) / (max - min));
        ctx.lineWidth = 1;
        ctx.strokeStyle = bgColor;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, h);
        ctx.stroke();
      }
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, h / 2 - 2, w, 4);

    pos = handleWidth / 2 + (w - handleWidth) * (value - min) / (max - min);
    const gradient = ctx.createLinearGradient(0, 0, pos, 0);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, h / 2 - 2, pos, 4);

    ctx.lineWidth = handleWidth;
    ctx.strokeStyle = colorEnd;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, h);
    ctx.stroke();

    return canvas.toDataURL();
  }
}

IoSliderKnob.Register();
