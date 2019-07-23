import {chunk} from "../../io-elements-core.js";
import {IoHsvaHue} from "./hsva-hue.js";

export class IoHsvaAlpha extends IoHsvaHue {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${chunk.hue2rgb}
      ${chunk.hsv2rgb}

      void main(void) {

        float tileSize = uSize.x / 32.0;
        tileSize = (tileSize - mod(tileSize, 1.0)) * 5.0;
        vec2 alphaPos = floor(vUv * vec2(tileSize, tileSize / uAspect));
        float alphaMask = mod(alphaPos.x + mod(alphaPos.y, 2.0), 2.0);
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), alphaMask);

        vec3 currentColor = hsv2rgb(uValue.xyz);

        vec3 final = alphaPattern;

        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;

        // Apha gradient
        final = mix(alphaPattern, currentColor, axis);

        // Apha marker
        float lineWidth = 4.0;
      	float hueMarkerOffset = abs(axis - uValue[3]) * ((uHorizontal == 1) ? uSize.x : uSize.y);
        float dist = hueMarkerOffset - lineWidth;
        float dist2 = hueMarkerOffset - (lineWidth + 1.0);
        final = mix(final, cssColor.rgb, saturate(1.0 - dist2));
        final = mix(final, cssBackgroundColor.rgb, saturate(1.0 - dist));

        gl_FragColor = vec4(final, 1.0);
      }
    `;
  }
  valueChanged() {
    super.valueChanged();
    const hasAlpha = this.value[this._c[3]] !== undefined;
    this.setAttribute('aria-invalid', !hasAlpha ? 'true' : false);
  }
  _setHSVA(x, y) {
    const hasAlpha = this.value[this._c[3]] !== undefined;
    if (hasAlpha) this.value[this._c[3]] = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
  }
}

IoHsvaAlpha.Register();
