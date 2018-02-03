import {html} from "../ioutil.js"
import {IoPointer} from "../iopointer.js"
import {Io} from "../io.js"

export class IoSlider extends IoPointer {
  static get shadowStyle() {
    return html`
      <style>
        :host {
          display: inline-block;
          cursor: ew-resize;
          min-width: 100px;
          position: relative;
        }
        ::slotted(.io-slider-slit) {
          position: absolute;
          width: 100%;
          height: 0.2em;
          background: #111;
          top: calc(50% - 0.1em);
        }
        ::slotted(.io-slider-knob) {
          position: absolute;
          width: 0.4em;
          height: 100%;
          background: #999;
          left: calc(50%);
        }
      </style>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Number,
        observer: '_update'
      },
      step: {
        type: Number,
        value: 0.01,
        observer: '_update'
      },
      min: {
        type: Number,
        value: 0,
        observer: '_update'
      },
      max: {
        type: Number,
        value: 1,
        observer: '_update'
      },
      attributes: {
        'tabindex': 0
      },
      listeners: {
        'io-pointer-hover': '_hoverHandler',
        'io-pointer-start': '_pointerStartHandler',
        'io-pointer-move': '_pointerMoveHandler',
        'io-pointer-end': '_pointerEndHandler'
      }
    }
  }
  _pointerStartHandler(event) {
    console.log('start')
  }
  _pointerMoveHandler(event) {
    // console.log('move')
    // console.log(event.detail.pointers[0].position);
    console.log(event.detail.pointers[0].movement);
  }
  _pointerEndHandler(event) {
    console.log('end')
    // console.log(event.detail.pointers[0].position);
  }
  _hoverHandler(event) {
    console.log('hover')
    // console.log(event.detail);
  }
  _update() {
    this.render([
      ['div', {className: 'io-slider-slit'}],
      ['div', {className: 'io-slider-knob'}],
      ['span', '\u00A0']
    ])
  }
}

window.customElements.define('io-slider', IoSlider);
