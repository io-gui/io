import {html} from "../../io.js";
import {IoLayerSingleton, IoGl, chunk} from "../../io-elements-core.js";
import {IoHsvaPicker} from "./hsva-picker.js";

export class IoHsvaSwatch extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        cursor: pointer;
        border-radius: var(--io-border-radius);
        border: var(--io-inset-border);
        width: calc(var(--io-line-height) + calc(2 * var(--io-spacing)));
        height: calc(var(--io-line-height) + calc(2 * var(--io-spacing)));
      }
      :host[aria-invalid] {
        outline: 1px solid var(--io-color-focus);
      }
      :host:focus {
        outline: 1px solid var(--io-color-focus);
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Properties() {
    return {
      value: [0.5, 0.5, 0.5, 0.5],
      horizontal: false,
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${chunk.hue2rgb}
      ${chunk.hsv2rgb}
      ${chunk.checker}

      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));
        vec3 finalColor = hsv2rgb(uValue.xyz);

        float alpha = uValue.a;
        float lineWidth = cssStrokeWidth * 2.0;

        vec2 pxUv = vUv * uSize;
        if (pxUv.x < lineWidth) alpha = 1.0;
        if (pxUv.y < lineWidth) alpha = 1.0;
        if (pxUv.x > uSize.x - lineWidth) alpha = 1.0;
        if (pxUv.y > uSize.y - lineWidth) alpha = 1.0;
        finalColor = mix(alphaPattern, finalColor, saturate(alpha));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  static get Listeners() {
    return {
      'mousedown': '_onMousedown',
      'keydown': '_onKeydown',
    };
  }
  _onMousedown() {
    event.preventDefault();
    this.focus();
    this._expand();
  }
  _onKeydown() {
    this._expand();
  }
  _expand() {
    const hasAlpha = this.value[3] !== undefined || this.value.a !== undefined;
    IoHsvaPicker.singleton.value = this.value;
    IoHsvaPicker.singleton.style.width = hasAlpha ? '192px' : '160px';
    IoHsvaPicker.singleton.style.height = '128px';
    IoHsvaPicker.singleton.expanded = true;
    IoLayerSingleton.clickblock = true;
    IoLayerSingleton.srcElement = this;
    IoLayerSingleton.setElementPosition(IoHsvaPicker.singleton, 'bottom', this.getBoundingClientRect());
  }
}

IoHsvaSwatch.Register();
