import {html} from "../../io.js";
import {IoGl} from "../../io-elements-core.js";
import {IoColorMixin} from "./color.js";

export class IoColorSwatch extends IoColorMixin(IoGl) {
  static get Style() {
    return html`<style>
      :host {
        border-radius: var(--io-border-radius);
        border: var(--io-inset-border);
        min-width: var(--io-line-height);
        min-height: var(--io-line-height);
      }
      :host[aria-invalid] {
        border: var(--io-border-error);
      }
      :host:focus {
        outline: 0;
        border-color: var(--io-color-focus);
      }
    </style>`;
  }
  static get GlUtils() {
    return /* glsl */`
    vec3 hue2rgb(float hue) {
      hue=fract(hue);
      float R = abs(hue * 6. - 3.) - 1.;
      float G = 2. - abs(hue * 6. - 2.);
      float B = 2. - abs(hue * 6. - 4.);
      return saturate(vec3(R,G,B));
    }
    vec3 hsv2rgb(vec3 hsv) {
      vec3 rgb = hue2rgb(hsv.r);
      return ((rgb - 1.) * hsv.g + 1.) * hsv.b;
    }
    vec3 hsl2rgb(vec3 hsl) {
      vec3 rgb = hue2rgb(hsl.x);
      float C = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
      return (rgb - 0.5) * C + hsl.z;
    }
    \n\n`;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;
      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));

        float alpha = uAlpha;
        float lineWidth = cssStrokeWidth * 2.0;
        vec2 pxUv = vUv * uSize;
        if (pxUv.x < lineWidth) alpha = 1.0;
        if (pxUv.y < lineWidth) alpha = 1.0;
        if (pxUv.x > uSize.x - lineWidth) alpha = 1.0;
        if (pxUv.y > uSize.y - lineWidth) alpha = 1.0;

        gl_FragColor = saturate(vec4(mix(alphaPattern, uRgb.rgb, alpha), 1.0));
      }
    `;
  }
}

IoColorSwatch.Register();
