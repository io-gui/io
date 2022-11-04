import { RegisterIoElement } from '../../core/element.js';
import { IoProperty } from '../../core/internals/property.js';
import { IoSliderBase } from './slider-base.js';

@RegisterIoElement
export class IoSliderRange extends IoSliderBase {

  @IoProperty({value: [0, 0], observe: true})
  declare value: [number, number];

  @IoProperty(0.01)
  declare step: number;

  @IoProperty(0)
  declare min: number;

  @IoProperty(1)
  declare max: number;

  _index = 0;

  _getCoordFromValue(value: [number, number]) {
    const coord = [0, 0];
    const min = this._min;
    const max = this._max;
    coord[0] = (value[0] - min[0]) / (max[0] - min[0]);
    coord[1] = (value[1] - min[1]) / (max[1] - min[1]);
    return coord;
  }
  _onPointerdown(event: PointerEvent) {
    super._onPointerdown(event);
    const value = this._value;
    const p = this._getPointerCoord(event);
    const c = this._getCoordFromValue(value);
    if (this.vertical) {
      this._index = Math.abs(c[0] - p[1]) < Math.abs(c[1] - p[1]) ? 0 : 1;
    } else {
      this._index = Math.abs(c[0] - p[0]) < Math.abs(c[1] - p[0]) ? 0 : 1;
    }
  }
  _onPointermoveThrottled(event: PointerEvent) {
    if (this._active === true) {
      if (document.activeElement !== this as unknown as Element) this.focus();
      const value = this._value;
      const coord = this._getPointerCoord(event);
      const newValue = this._getValueFromCoord(coord);
      if (this._index === 0) {
        this._inputValue([this.vertical ? newValue[1] : newValue[0], value[1]]);
      } else if (this._index === 1) {
        this._inputValue([value[0], this.vertical ? newValue[1] : newValue[0]]);
      }
    }
  }
  static get GlUtils() {
    return /* glsl */`
      vec4 paintSliderRange(vec2 p, vec2 size, vec3 colorStart, vec3 colorEnd) {
        vec4 finalCol = vec4(0.0);

        float valueInRangeStart = (uValue[0] - uMin) / (uMax - uMin);
        float signStart = valueInRangeStart < 0.0 ? -1.0 : 1.0;
        valueInRangeStart = abs(pow(valueInRangeStart, 1./uExponent)) * signStart;

        float valueInRangeEnd = (uValue[1] - uMin) / (uMax - uMin);
        valueInRangeEnd = abs(pow(valueInRangeEnd, 1./uExponent));

        vec2 start = vec2(size.x * min(2.0, max(-1.0, (valueInRangeStart))), size.y * 0.5);
        vec2 end = vec2(size.x * min(2.0, max(-1.0, (valueInRangeEnd))), size.y * 0.5);

        vec2 pStart = translate(p, start);
        vec2 pEnd = translate(p, end);
        vec2 pCenter = (pStart + pEnd) / 2.0;
        float slotHalfWidth = abs(pStart.x - pEnd.x) / 2.0;

        float slotThickness = ioFieldHeight * 0.125;
        float knobRadius = ioFieldHeight * 0.25;

        float strokeShape = min(min(
          circle(pStart, knobRadius + ioStrokeWidth + ioStrokeWidth),
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + ioStrokeWidth + ioStrokeWidth))),
          circle(pEnd, knobRadius + ioStrokeWidth + ioStrokeWidth)
        );

        float fillShape   = min(min(
          circle(pStart, knobRadius + ioStrokeWidth),
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness + ioStrokeWidth))),
          circle(pEnd, knobRadius + ioStrokeWidth)
        );
        float colorShape  = min(min(
          circle(pStart, knobRadius),
          rectangle(pCenter, vec2(slotHalfWidth, slotThickness))),
          circle(pEnd, knobRadius)
        );

        float grad = (p.x - start.x) / (end.x - start.x);
        vec3 slotGradient = mix(colorStart, colorEnd, saturate(grad));

        finalCol = mix(ioColor, finalCol, strokeShape);
        finalCol = mix(vec4(ioBackgroundColor.rgb, 1.0), finalCol, fillShape);
        finalCol = mix(vec4(slotGradient, 1.0), finalCol, colorShape);

        return finalCol;
      }
    `;
  }
  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * uv;

      // Colors
      vec3 finalCol = ioBackgroundColorField.rgb;
      vec4 gridCol = mix(ioColor, ioBackgroundColorField, 0.75);

      // Sizes
      float gridThickness = ioStrokeWidth;
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uMin, uStep) / (uMax - uMin) * size.x;

      // Grid
      vec2 expPosition = size * vec2(pow(uv.x, uExponent), uv.y);
      vec2 gridPosition = translate(expPosition, gridOffset, size.y / 2.);
      float gridShape = grid2d(gridPosition, vec2(gridSize, size.y + gridThickness * 2.0), gridThickness);

      if (gridSize > gridThickness * 2.0) {
        finalCol.rgb = mix(gridCol.rgb, finalCol.rgb, gridShape);
      }

      // Slider
      vec4 slider = paintSliderRange(position, size, ioColorFocus.rgb, ioColorLink.rgb);
      finalCol = mix(finalCol.rgb, slider.rgb, slider.a);

      gl_FragColor = vec4(finalCol, 1.0);
    }
    `;
  }
}

