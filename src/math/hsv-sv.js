import {IoHsvHue} from "./hsv-hue.js";

export class IoHsvSv extends IoHsvHue {
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

        vec2 alphaPos = floor(vUv * size / 32.0 * 3.0);
        float alphaMask = mod(alphaPos.x + mod(alphaPos.y, 2.0), 2.0);
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), alphaMask);

        vec3 currentColor = hsv_to_rgb(hsva.xyz);

        vec3 final = alphaPattern;

        float markerSize = 12.0;
        float lineWidth = 1.0;

        // SV gradient
        final = hsv_to_rgb(vec3(hsva[0], vUv.x, vUv.y));

        // Color marker
        float offset = length((vUv - vec2(hsva[1], hsva[2])) * size);

        float distOut = (offset - (markerSize - lineWidth));
        float distIn = 1.0 - (offset - (markerSize + lineWidth));
        float dist = saturate(min(distOut, distIn));

        float distOut2 = (offset - (markerSize - (lineWidth + 1.0)));
        float distIn2 = 1.0 - (offset - (markerSize + (lineWidth + 1.0)));
        float dist2 = saturate(min(distOut2, distIn2));

        currentColor = mix(alphaPattern, currentColor, hsva.a);

        final = mix(final, currentColor, saturate(distIn));
        final = mix(final, vec3(0.0), dist2);
        final = mix(final, vec3(1.0), dist);

        gl_FragColor = vec4(final, 1.0);
      }
    `;
  }
  _setHSVA(x, y) {
    this.hsva[1] = Math.max(0, Math.min(1, x));
    this.hsva[2] = Math.max(0, Math.min(1, 1 - y));
  }
}

IoHsvSv.Register();
