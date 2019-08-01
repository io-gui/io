import {chunk} from "../../io-elements-core.js";
import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderHue extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      ${chunk.hue2rgb}
      ${chunk.hsv2rgb}
      ${chunk.translate}
      ${chunk.circle}
      ${chunk.rectangle}

      void main(void) {
        vec2 position = vUv * uSize;

        // Hue spectrum
        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;
        vec3 finalColor = hsv2rgb(vec3(axis, 1.0, 1.0));

        vec3 currentColor = saturate(hsv2rgb(vec3(uValue[0], 1.0, 1.0)));

        // Marker
        float posX = uSize.x * ((uHorizontal == 1) ? uValue[0] : 0.5);
        float posY = uSize.y * ((uHorizontal == 1) ? 0.5 : uValue[0]);
        float radius = cssItemHeight / 5.0;
        float widthX = (uHorizontal == 1) ? cssStrokeWidth * 2.0 : uSize.x;
        float widthY = (uHorizontal == 1) ? uSize.y : cssStrokeWidth * 2.0;

        vec2 markerPos = translate(position, posX, posY);

        float circleStrokeShape = circle(markerPos, radius + cssStrokeWidth);
        float rectStrokeShape = rectangle(markerPos, vec2(widthX + cssStrokeWidth, widthY + cssStrokeWidth));
        finalColor = mix(cssColor.rgb, finalColor, min(rectStrokeShape, circleStrokeShape));

        float circleShape = circle(markerPos, radius);
        float rectShape = rectangle(markerPos, vec2(widthX, widthY));
        finalColor = mix(cssBackgroundColor.rgb, finalColor, min(rectShape, circleShape));

        float circleInnerShape = circle(markerPos, radius - cssStrokeWidth);
        float rectInnerShape = rectangle(markerPos, vec2(widthX - cssStrokeWidth, widthY - cssStrokeWidth));
        finalColor = mix(currentColor.rgb, finalColor, min(rectInnerShape, circleInnerShape));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  _setValue(x, y) {
    this.value[this.components[0]] = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
  }
}

IoColorSliderHue.Register();
