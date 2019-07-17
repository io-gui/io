import {html, IoGl} from "../../io.js";
import {IoRgbaPicker} from "./rgba-picker.js";

export class IoRgbaSwatch extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        cursor: pointer;
        border-radius: var(--io-border-radius);
        -webkit-tap-highlight-color: transparent;
        min-width: 32px;
        min-height: 1.375em;
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

      void main(void) {
        float tileSize = uSize.x / 32.0;
        tileSize = (tileSize - mod(tileSize, 1.0)) * 5.0;
        vec2 alphaPos = floor(vUv * vec2(tileSize, tileSize / uAspect));
        float alphaMask = mod(alphaPos.x + mod(alphaPos.y, 2.0), 2.0);
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), alphaMask);

        float alpha = uValue.a;

        float borderWidth = 4.0;
        vec2 pxUv = vUv * uSize;
        if (pxUv.x < borderWidth) alpha = 1.0;
        if (pxUv.y < borderWidth) alpha = 1.0;
        if (pxUv.x > uSize.x - borderWidth) alpha = 1.0;
        if (pxUv.y > uSize.y - borderWidth) alpha = 1.0;

        gl_FragColor = vec4(mix(alphaPattern, uValue.rgb, alpha), 1.0);
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
    IoRgbaPicker.singleton.value = this.value;
    IoRgbaPicker.singleton.style.width = hasAlpha ? '192px' : '160px';
    IoRgbaPicker.singleton.style.height = '128px';
    IoRgbaPicker.singleton.expanded = true;
    IoMathLayer.singleton.setElementPosition(IoRgbaPicker.singleton, 'bottom', this.getBoundingClientRect());
  }
}

IoRgbaSwatch.Register();
