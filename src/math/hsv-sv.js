import {IoHsvaHue} from "./hsv-hue.js";

export class IoHsvaSv extends IoHsvaHue {
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

        float markerSize = 12.0;
        float lineWidth = 1.0;

        // SV gradient
        final = hsv_to_rgb(vec3(uValue[0], vUv.x, vUv.y));

        // Color marker
        float offset = length((vUv - vec2(uValue[1], uValue[2])) * uSize);

        float distOut = (offset - (markerSize - lineWidth));
        float distIn = 1.0 - (offset - (markerSize + lineWidth));
        float dist = saturate(min(distOut, distIn));

        float distOut2 = (offset - (markerSize - (lineWidth + 1.0)));
        float distIn2 = 1.0 - (offset - (markerSize + (lineWidth + 1.0)));
        float dist2 = saturate(min(distOut2, distIn2));

        currentColor = mix(alphaPattern, currentColor, uValue.a);

        final = mix(final, currentColor, saturate(distIn));
        final = mix(final, vec3(0.0), dist2);
        final = mix(final, vec3(1.0), dist);

        gl_FragColor = vec4(final, 1.0);
      }
    `;
  }
  _setHSVA(x, y) {
    this.value[1] = Math.max(0, Math.min(1, x));
    this.value[2] = Math.max(0, Math.min(1, 1 - y));
  }
}

IoHsvaSv.Register();
