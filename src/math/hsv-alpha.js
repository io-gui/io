import {IoHsvaHue} from "./hsv-hue.js";

export class IoHsvaAlpha extends IoHsvaHue {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      #ifndef saturate
        #define saturate(v) clamp(v, 0., 1.)
      #endif

      vec3 hue_to_rgb(float hue) {
        float R = abs(hue * 6. - 3.) - 1.;
        float G = 2. - abs(hue * 6. - 2.);
        float B = 2. - abs(hue * 6. - 4.);
        return saturate(vec3(R,G,B));
      }

      vec3 hsv_to_rgb(vec3 hsv) {
        vec3 rgb = hue_to_rgb(hsv.r);
        return ((rgb - 1.0) * hsv.g + 1.0) * hsv.b;
      }

      void main(void) {

        float tileSize = uSize.x / 32.0;
        tileSize = (tileSize - mod(tileSize, 1.0)) * 5.0;
        vec2 alphaPos = floor(vUv * vec2(tileSize, tileSize / uAspect));
        float alphaMask = mod(alphaPos.x + mod(alphaPos.y, 2.0), 2.0);
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), alphaMask);

        vec3 currentColor = hsv_to_rgb(uValue.xyz);

        vec3 final = alphaPattern;

        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;
        float lineWidth = 1.0;

        // Apha gradient
        final = mix(alphaPattern, currentColor, axis);

        // Apha marker
      	float hueMarkerOffset = abs(axis - uValue[3]) * ((uHorizontal == 1) ? uSize.x : uSize.y);
        float dist = hueMarkerOffset - lineWidth;
        float dist2 = hueMarkerOffset - (lineWidth + 1.0);
        final = mix(final, vec3(0.0), max(1.0 - dist2, 0.0));
        final = mix(final, vec3(1.0), max(1.0 - dist, 0.0));

        gl_FragColor = vec4(final, 1.0);
      }
    `;
  }
  _setHSVA(x, y) {
    this.value[3] = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
  }
}

IoHsvaAlpha.Register();
