import {IoColorSlider} from "./color-slider.js";

export class IoColorSliderAlpha extends IoColorSlider {
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;

      void main(void) {
        vec2 position = vUv * uSize;

        // Alpha pattern
        vec3 alphaPattern = mix(vec3(0.5), vec3(1.0), checker(position, 5.0));
        vec3 finalColor = alphaPattern;

        // Apha gradient
        float axis = (uHorizontal == 1) ? vUv.x : vUv.y;
        finalColor = mix(finalColor, vec3(1.0), axis);

        // Marker
        float posX = uSize.x * ((uHorizontal == 1) ? uAlpha : 0.5);
        float posY = uSize.y * ((uHorizontal == 1) ? 0.5 : uAlpha);
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

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;
  }
  valueChanged() {
    super.valueChanged();
    const hasAlpha = this.value[this.components[3]] !== undefined;
    this.setAttribute('aria-invalid', !hasAlpha ? 'true' : false);
  }
  _setValue(x, y) {
    const a = Math.max(0, Math.min(1, this.horizontal ? x : (1 - y)));
    const c = this.mode === 3 ? 4 : 3;
    const hasAlpha = this.value[this.components[c]] !== undefined;
    if (hasAlpha) this.value[this.components[c]] = a;
  }
}

IoColorSliderAlpha.Register();
