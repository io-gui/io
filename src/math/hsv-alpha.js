import {IoHsvHue} from "./hsv-hue.js";

export class IoHsvAlpha extends IoHsvHue {
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

        float axis = (horizontal == 1) ? vUv.x : vUv.y;
        float lineWidth = 1.0;

        // Apha gradient
        final = mix(alphaPattern, currentColor, axis);

        // Apha marker
      	float hueMarkerOffset = abs(axis - hsva[3]) * ((horizontal == 1) ? size.x : size.y);
        float dist = hueMarkerOffset - lineWidth;
        float dist2 = hueMarkerOffset - (lineWidth + 1.0);
        final = mix(final, vec3(0.0), max(1.0 - dist2, 0.0));
        final = mix(final, vec3(1.0), max(1.0 - dist, 0.0));

        gl_FragColor = vec4(final, 1.0);
      }
    `;
  }
  _setHSVA(x, y) {
    this.hsva[3] = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
  }
}

IoHsvAlpha.Register();
