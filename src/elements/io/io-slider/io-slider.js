import {html, IoElement} from "../../../io-element.js";
import {IoPointerMixin} from "../../../mixins/iopointer.js";

export class IoSlider extends IoPointerMixin(IoElement) {
  static get style() {
    return html`<style>
      :host {
        display: inline-block;
        cursor: ew-resize;
        min-width: 6em;
        min-height: 1.22em;
        position: relative;
        vertical-align: bottom;
      }
      :host > .io-slider-slit {
        position: absolute;
        width: 100%;
        height: 0.2em;
        top: calc(50% - 0.1em);
      }
      :host > .io-slider-knob {
        position: absolute;
        width: 0.4em;
        margin-left: -0.2em;
        height: 100%;
        background: #999;
        left: calc(50%);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: Number,
      step: 0.01,
      min: 0,
      max: 100,
      pointermode: 'relative',
      tabindex: 0
    };
  }
  static get listeners() {
    return {
      'io-pointer-move': '_onPointerMove'
    };
  }
  _onPointerMove(event) {
    let rect = this.getBoundingClientRect();
    let x = event.detail.pointer[0].position.x / rect.width;
    let pos = Math.max(0,Math.min(1, x));
    // TODO: implement step
    this.set('value', this.min + (this.max - this.min) * pos);
  }
  update() {
    let pos = 100 * (this.value - this.min) / (this.max - this.min);
    this.render([
      ['div', {className: 'io-slider-slit', style: {
          background: 'linear-gradient(to right, #2cf, #2f6 ' + pos + '%, #333 ' + (pos + 1) + '%)'}}],
      ['div', {className: 'io-slider-knob', style: {left: pos + '%'}}]
    ]);
  }
}

IoSlider.Register();