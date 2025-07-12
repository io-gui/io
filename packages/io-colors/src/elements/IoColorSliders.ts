import { Register, ReactiveProperty, glsl, WithBinding, Node } from 'io-gui';
import { IoSlider, IoSlider2d } from 'io-sliders';
import { IoColorBase, IoColorBaseProps } from './IoColorBase.js';

export type IoColorSliderProps = IoColorBaseProps & {
  color?: WithBinding<[number, number, number, number]>,
  step?: number,
  channel?: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'v' | 'l' | 'hs' | 'sv' | 'sl',
  vertical?: boolean,
};

/**
 * A generic color slider element.
 * It is a wrapper for channel-specific sliders which are added as a child of this element depending on the `channel` property.
 * For example, setting `channel: 'h'` will instantiate a slider for "hue" color channel and hook up necessary conversions, bindings and event callbacks.
 **/
@Register
export class IoColorSlider extends IoColorBase {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
      }
    `;
  }

  // Is this needed? Perhgaps value can be used in glsl?
  @ReactiveProperty({type: Array, init: [0, 0, 0, 0]})
  declare color: [number, number, number, number];

  @ReactiveProperty(0.01)
  declare step: number;

  @ReactiveProperty('a')
  declare channel: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'v' | 'l' | 'hs' | 'sv' | 'sl';

  @ReactiveProperty({value: false, reflect: true})
  declare vertical: boolean;

  _onValueInput(event: CustomEvent) {
    const v = event.detail.value;
    const oldValue = JSON.stringify(this.value);
    switch (this.channel) {
      case 'r':
        this.value.r = v;
        break;
        case 'g':
        this.value.g = v;
        break;
        case 'b':
        this.value.b = v;
        break;
        case 'a':
        this.value.a = v;
        break;
      case 'h':
        this.hsv[0] = v;
        this.rgbFromHsv();
        this.valueFromRgb();
        break;
      case 's':
        this.hsv[1] = v;
        this.rgbFromHsv();
        this.valueFromRgb();
        break;
      case 'v':
        this.hsv[2] = v;
        this.rgbFromHsv();
        this.valueFromRgb();
        break;
      case 'l':
        this.hsl[2] = v;
        this.rgbFromHsl();
        this.valueFromRgb();
        break;
      case 'hs':
        this.hsv[0] = v[0];
        this.hsv[1] = v[1];
        this.rgbFromHsv();
        this.valueFromRgb();
        break;
      case 'sv':
        this.hsv[1] = v[0];
        this.hsv[2] = v[1];
        this.rgbFromHsv();
        this.valueFromRgb();
        break;
      case 'sl':
        this.hsl[1] = v[0];
        this.hsl[2] = v[1];
        this.rgbFromHsl();
        this.valueFromRgb();
        break;
    }
    if (oldValue === JSON.stringify(this.value)) return;

    if (!(this.value as unknown as Node)._isNode) {
      this.dispatchMutation(this.value);
    }
    this.dispatch('value-input', {property: 'value', value: this.value}, false);
  }

  changed() {
    const c = this.channel;

    debug: if (['r', 'g', 'b', 'a', 'h', 's', 'v', 'l', 'hs', 'sv', 'sl'].indexOf(c) === -1) {
      console.warn('IoColorSlider: Incorrect channel value!', c);
    }

    let slider = null;
    switch (c) {
      case 'r': slider = ioColorSliderR(); break;
      case 'g': slider = ioColorSliderG(); break;
      case 'b': slider = ioColorSliderB(); break;
      case 'a': slider = ioColorSliderA(); break;
      case 'h': slider = ioColorSliderH(); break;
      case 's': slider = ioColorSliderS(); break;
      case 'v': slider = ioColorSliderV(); break;
      case 'l': slider = ioColorSliderL(); break;
      case 'hs': slider = ioColorSliderHs(); break;
      case 'sv': slider = ioColorSliderSv(); break;
      case 'sl': slider = ioColorSliderSl(); break;
    }
    let value: number | [number, number] = 0;
    let color: [number, number, number, number] = [0, 0, 0, 0];
    let min: number | [number, number] = 0;
    let max: number | [number, number] = 1;
    let step: number | [number, number] = this.step;

    switch (this.channel) {
      case 'r':
        value = this.value.r;
        color = [...this.rgba];
        break;
      case 'g':
        value = this.value.g;
        color = [...this.rgba];
        break;
      case 'b':
        value = this.value.b;
        color = [...this.rgba];
        break;
      case 'a':
        value = this.value.a || 0;
        color = [...this.rgba];
        break;
      case 'h':
        value = this.hsv[0];
        color = [...this.hsv, 1];
        break;
      case 's':
        value = this.hsv[1];
        color = [...this.hsv, 1];
        break;
      case 'v':
        value = this.hsv[2];
        color = [...this.hsv, 1];
        break;
      case 'l':
        value = this.hsl[2];
        color = [...this.hsl, 1];
        break;
      case 'hs':
        value = [this.hsv[0], this.hsv[1]];
        color = [...this.hsv, 1];
        min = [min, min];
        max = [max, max];
        step = [step, step];
        break;
      case 'sv':
        value = [this.hsv[1], this.hsv[2]];
        color = [...this.hsv, 1];
        min = [min, min];
        max = [max, max];
        step = [step, step];
        break;
      case 'sl':
        value = [this.hsl[1], this.hsl[2]];
        color = [...this.hsl, 1];
        min = [min, min];
        max = [max, max];
        step = [step, step];
        break;
    }

    // TODO: values are always new objects which causes double rendering when interacting with the slider.
    // This causes change() to be called so does valueMutated() from the slider itself.
    // TODO: Fix!
    slider.props = {id: c, value: value, min: min, max: max, step: step, vertical: this.vertical, color: color, '@value-input': this._onValueInput};

    this.render([
      slider,
    ]);
  }
}
export const ioColorSlider = function(arg0?: IoColorSliderProps) {
  return IoColorSlider.vConstructor(arg0);
};
/**
 * A base class for 1D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
class IoColorSliderBase extends IoSlider {
  @ReactiveProperty({type: Array, init: [0, 0, 0, 0]})
  declare color: [number, number, number, number];

  static get GlUtils() {
    return /* glsl */`
      // Note: Implement in subclass!
      // TODO: Allow GlUtils to rewrite inherited functions!
      // vec3 getStartColor(vec2 uv) {}
      // vec3 getEndColor(vec2 uv) {}
      ${glsl.hue2rgb}
      ${glsl.hsv2rgb}
      ${glsl.hsl2rgb}

      vec3 paintHorizontalLine(vec3 dstCol, vec2 p, vec3 color) {
        float lineShape = lineHorizontal(p, io_borderWidth * 2.0);
        return compose(dstCol, vec4(color, lineShape));
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
      vec2 position = size * vec2(uv.x, uv.y - 0.5);
      float valueInRange = (uValue - uMin) / (uMax - uMin);

      // Colors
      vec3 finalCol = io_bgColorInput.rgb;
      vec3 startCol = getStartColor(uv);
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 endCol = getEndColor(uv);
      vec3 sliderCol = mix(startCol, endCol, uv.x);

      vec2 linePos = translate(size * uv, 0.0, size.y / 2.);
      finalCol = paintHorizontalLine(finalCol, linePos, sliderCol);

      // Grid
      float gridSize = size.x / abs((uMax - uMin) / uStep);
      float gridOffset = mod(uStep - uMin, uStep) / (uMax - uMin) * size.x;
      float gridShape = paintDerivativeGrid2D(translate(position, gridOffset, 0.0), vec2(gridSize, 0.0), io_borderWidth);
      if (size.x * uStep < 4.0) gridShape = 0.0;
      finalCol = compose(finalCol, vec4(sliderCol, gridShape * 0.25));

      // Slider
      float sliderShape = rectangle(position, vec2(size.x * valueInRange, size.y));
      finalCol = compose(finalCol, vec4(sliderCol, sliderShape));
      finalCol = compose(finalCol, vec4(io_bgColorInput.rgb, gridShape * sliderShape * 0.125));

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
  // TODO: temp fix
  valueMutated() {}
}

/**
 * A base class for 2D color slider.
 * It as an incomplete implementation of a color slider desiged to be fully implemented in channel-specific subclasses.
 **/
class IoColorSlider2dBase extends IoSlider2d {
  @ReactiveProperty({type: Array, init: [0, 0, 0, 0]})
  declare color: [number, number, number, number];

  static get GlUtils() {
    return /* glsl */`
      // Note: Implement in subclass!
      // TODO: Allow GlUtils to rewrite inherited functions!
      // vec3 getColor(vec2 uv) {}
      ${glsl.hue2rgb}
      ${glsl.hsv2rgb}
      ${glsl.hsl2rgb}
    `;
  }
  static get Frag() {
    return /* glsl */`
    varying vec2 vUv;

    void main(void) {
      // Dimensions
      vec2 size = uVertical == 1 ? uSize.yx : uSize;
      vec2 uv = uVertical == 1 ? vUv.yx : vUv;
      vec2 position = size * (uv - vec2(0.5));

      // Colors
      vec3 finalCol = color_field(uv);
      vec3 gridCol = io_bgColorLight.rgb;
      vec3 sliderCol = color_field(uValue);

      // Grid
      vec2 gridSize = size / abs((uMax - uMin) / uStep);
      vec2 gridOffset = (uMax + uMin) / (uMax - uMin) * size / 2.;
      vec2 gridPosition = translate(position, -gridOffset);
      float gridShape = paintDerivativeGrid2D(gridPosition, gridSize, io_borderWidth);
      if (min(size.x * uStep.x, size.y * uStep.y) < 2.0) gridShape = 0.0;
      finalCol = compose(finalCol, vec4(gridCol, gridShape * 0.5));

      vec2 knobPos = uValue / (uMax - uMin) * size;
      finalCol = paintKnob(finalCol, gridPosition, knobPos, sliderCol);

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
  }
  // TODO: temp fix
  valueMutated() {}
}

/**
 * A 1D slider for "red" color channel.
 **/
@Register
export class IoColorSliderR extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        return vec3(uv.x, uColor[1], uColor[2]);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uv.x, uColor[1], uColor[2]);
      }
    `;
  }
}
export const ioColorSliderR = function(arg0?: IoColorSliderProps) {
  return IoColorSliderR.vConstructor(arg0);
};

/**
 * A 1D slider for "green" color channel.
 **/
@Register
export class IoColorSliderG extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        return vec3(uColor[0], uv.x, uColor[2]);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uColor[0], uv.x, uColor[2]);
      }
    `;
  }
}
export const ioColorSliderG = function(arg0?: IoColorSliderProps) {
  return IoColorSliderG.vConstructor(arg0);
};

/**
 * A 1D slider for "blue" color channel.
 **/
@Register
export class IoColorSliderB extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        return vec3(uColor[0], uColor[1], uv.x);
      }
      vec3 getEndColor(vec2 uv) {
        return vec3(uColor[0], uColor[1], uv.x);
      }
    `;
  }
}
export const ioColorSliderB = function(arg0?: IoColorSliderProps) {
  return IoColorSliderB.vConstructor(arg0);
};
/**
 * A 1D slider for "alpha" color channel.
 **/
@Register
export class IoColorSliderA extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 position = size * (uv - vec2(0.0, 0.5));
        return mix(vec3(0.5), vec3(1.0), checkerX(position, io_fieldHeight / 4.0));
      }
      vec3 getEndColor(vec2 uv) {
        vec2 size = uVertical == 1 ? uSize.yx : uSize;
        vec2 position = size * (uv - vec2(0.0, 0.5));
        vec3 chkCol = mix(vec3(0.5), vec3(1.0), checkerX(position, io_fieldHeight / 4.0));
        return mix(chkCol, uColor.rgb, 1.0);
      }
    `;
  }
}
export const ioColorSliderA = function(arg0?: IoColorSliderProps) {
  return IoColorSliderA.vConstructor(arg0);
};

/**
 * A 1D slider for "hue" color channel.
 **/
@Register
export class IoColorSliderH extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        return hsv2rgb(vec3(uv.x, uColor[1], uColor[2]));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uv.x, uColor[1], uColor[2]));
      }
    `;
  }
}
export const ioColorSliderH = function(arg0?: IoColorSliderProps) {
  return IoColorSliderH.vConstructor(arg0);
};
/**
 * A 1D slider for "saturation" color channel.
 **/
@Register
export class IoColorSliderS extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv.x, uColor[2]));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv.x, uColor[2]));
      }
    `;
  }
}
export const ioColorSliderS = function(arg0?: IoColorSliderProps) {
  return IoColorSliderS.vConstructor(arg0);
};

/**
 * A 1D slider for "value" color channel.
 **/
@Register
export class IoColorSliderV extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
      vec3 getEndColor(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
    `;
  }
}
export const ioColorSliderV = function(arg0?: IoColorSliderProps) {
  return IoColorSliderV.vConstructor(arg0);
};

/**
 * A 1D slider for "level" color channel.
 **/
@Register
export class IoColorSliderL extends IoColorSliderBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 getStartColor(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
      vec3 getEndColor(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uColor[1], uv.x));
      }
    `;
  }
}
export const ioColorSliderL = function(arg0?: IoColorSliderProps) {
  return IoColorSliderL.vConstructor(arg0);
};

/**
 * A 2D slider gor "hue" and "saturation" color channels.
 **/
@Register
export class IoColorSliderHs extends IoColorSlider2dBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 color_field(vec2 uv) {
        return hsv2rgb(vec3(uv, uColor[2]));
      }
    `;
  }
}
export const ioColorSliderHs = function(arg0?: IoColorSliderProps) {
  return IoColorSliderHs.vConstructor(arg0);
};

/**
 * A 2D slider gor "saturation" and "value" color channels.
 **/
@Register
export class IoColorSliderSv extends IoColorSlider2dBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 color_field(vec2 uv) {
        return hsv2rgb(vec3(uColor[0], uv));
      }
    `;
  }
}
export const ioColorSliderSv = function(arg0?: IoColorSliderProps) {
  return IoColorSliderSv.vConstructor(arg0);
};

/**
 * A 2D slider gor "saturation" and "level" color channels.
 **/
@Register
export class IoColorSliderSl extends IoColorSlider2dBase {
  static get GlUtils() {
    return /* glsl */`
      vec3 color_field(vec2 uv) {
        return hsl2rgb(vec3(uColor[0], uv));
      }
    `;
  }
}
export const ioColorSliderSl = function(arg0?: IoColorSliderProps) {
  return IoColorSliderSl.vConstructor(arg0);
};
