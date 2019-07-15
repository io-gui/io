import {html, IoElement, IoGl} from "../io.js";

export class IoColorPicker extends IoGl {
  static get Style() {
    return html`<style>
      :host {
        display: flex;
        width: 165px;
        height: 65px;
      }
    </style>`;
  }
  static get Properties() {
    return {
      background: [0, 0, 0, 1],
      color: [1, 0, 1, 1],
      size: [0, 0],
      wheelWidth: 32,
      radius: 8,
      thicknes:1.5,
    };
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      vec3 sv2Color(in vec2 sv, in vec3 color) {
        vec3 val = mix(vec3(0.0), vec3(1.0), sv.y);
        return mix(val, color, sv.x);
      }

      const int stopCount = 6;
      vec3 getStop(int i) {
        vec3 result = vec3(0);
        if (i == 0) result = vec3(1.0, 0.0, 0.0);
        else if (i == 1) result = vec3(1.0, 0.0, 1.0);
        else if (i == 2) result = vec3(0.0, 0.0, 1.0);
        else if (i == 3) result = vec3(0.0, 1.0, 1.0);
        else if (i == 4) result = vec3(0.0, 1.0, 0.0);
        else if (i == 5) result = vec3(1.0, 1.0, 0.0);
        return result;
      }

      void main(void) {
        vec3 final = background.rgb;

        // hue gradient and color marker
        vec3 hue = vec3(1.0, 0.0, 1.0);
        vec2 val = vec2(0.5, 0.5);
        float hueVal = 0.5;

        float split = max(0.5, ((size.x - wheelWidth) / size.x));
        if (vUv.x <= split) {
          vec2 sv = mix(
            mix(vec2(0.0, 0.0), vec2(0.0, 1.0), vUv.x / split),
            mix(vec2(0.0, 0.0), vec2(1.0, 0.0), vUv.x / split),
            vUv.y
          );
          final = sv2Color(sv, hue);

          // Color marker
          vec2 offset = vec2(vUv.x, vUv.y) - vec2(val.x, val.y);
          float distOut = (length(offset * size) - (radius - (thicknes / 2.0)));
          float distIn = 1.0 - (length(offset * size) - (radius + (thicknes / 2.0)));
          float dist = min(1.0, max(min(distOut, distIn), 0.0));
          final = mix(final, color.rgb, max(distIn, 0.0));
          final = mix(final, vec3(1.0), dist);
        }

        // Hue wheel and hue marker
        if (vUv.x > split) {
          const float frac = 1.0 / float(stopCount);
          for (int i = 0; i < stopCount; ++i) {
            if (vUv.y <= frac * float(i + 1)) {
              int n = i + 1;
              if (n == stopCount) {
                n = 0;
              };
              final = mix(getStop(i), getStop(n), (vUv.y - frac * float(i)) * 1.0 / frac);
              break;
            }
          }

          // Color marker
        	float offset = abs(vUv.y - hueVal);
          float dist = (offset * size.y) - (thicknes / 2.0);
          dist = max(1.0 - dist, 0.0);
          final = mix(final, vec3(1.0), dist);

        }

        gl_FragColor = vec4(final, 1.0);

      }
    `;
  }
}

IoColorPicker.Register();
