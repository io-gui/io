import {html} from "../../io.js";
import {IoColorSwatch} from "./color-swatch.js";

export class IoColorSlider extends IoColorSwatch {
  static get Style() {
    return html`<style>
      :host {
        cursor: ns-resize;
      }
      :host[horizontal] {
        cursor: ew-resize;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Properties() {
    return {
      horizontal: {
        value: false,
        reflect: 1,
      },
    };
  }
  static get GlUtils() {
    return /* glsl */`
    vec2 translateSlider(vec2 position, vec2 value) {
      float posX = uSize.x * ((uHorizontal == 1) ? value.x : value.y);
      float posY = uSize.y * ((uHorizontal == 1) ? value.y : value.x);
      return translate(position, posX, posY);
    }
    vec2 repeatX(vec2 position) {
      float x = min(mod(uSize.x + position.x, uSize.x), mod(uSize.x - position.x, uSize.x));
      return vec2(x, position.y);
    }
    vec2 repeatY(vec2 position) {
      float y = min(mod(uSize.y + position.y, uSize.y), mod(uSize.y - position.y, uSize.y));
      return vec2(position.x, y);
    }
    vec4 paintSlider(vec2 position, vec3 color) {
      vec4 sliderColor = vec4(0.0);
      float radius = cssItemHeight / 5.0;
      float stroke = cssStrokeWidth;
      vec2 width = (uHorizontal == 1) ? vec2(stroke * 2.0, uSize.y) : vec2(uSize.x, stroke * 2.0);
      float strokeShape = min(rectangle(position, width + vec2(stroke)), circle(position, radius + stroke));
      sliderColor = mix(vec4(cssColor.rgb, 1.0), sliderColor, strokeShape);
      float fillShape = min(rectangle(position, width), circle(position, radius));
      sliderColor = mix(vec4(cssBackgroundColor.rgb, 1.0), sliderColor, fillShape);
      float colorShape = min(rectangle(position, width - vec2(stroke)), circle(position, radius - stroke));
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);
      return sliderColor;
    }
    vec4 paintSlider2D(vec2 position, vec3 color) {
      vec4 sliderColor = vec4(0.0);
      float radius = cssItemHeight / 5.0;
      float stroke = cssStrokeWidth;
      vec2 width = (uHorizontal == 1) ? vec2(stroke * 2.0, uSize.y) : vec2(uSize.x, stroke * 2.0);
      float strokeShape = circle(position, radius + stroke);
      sliderColor = mix(vec4(cssColor.rgb, 1.0), sliderColor, strokeShape);
      float fillShape = circle(position, radius);
      sliderColor = mix(vec4(cssBackgroundColor.rgb, 1.0), sliderColor, fillShape);
      float colorShape = circle(position, radius - stroke);
      sliderColor = mix(vec4(color, 1.0), sliderColor, colorShape);
      return sliderColor;
    }
    \n\n`;
  }
  static get Listeners() {
    return {
      'touchstart': '_onTouchstart',
      'mousedown': '_onMousedown',
      'keydown': '_onKeydown',
    };
  }
  _onTouchstart(event) {
    event.preventDefault();
    this.addEventListener('touchmove', this._onTouchmove);
    this.addEventListener('touchend', this._onTouchend);
    this._onPointerdown(event);
    this.focus();
  }
  _onTouchmove(event) {
    event.preventDefault();
    this._onPointermove(event);
  }
  _onTouchend() {
    this.removeEventListener('touchmove', this._onTouchmove);
    this.removeEventListener('touchend', this._onTouchend);
  }
  _onMousedown(event) {
    event.preventDefault();
    this.focus();
    window.addEventListener('mousemove', this._onMousemove);
    window.addEventListener('mouseup', this._onMouseup);
    this._onPointerdown(event);
  }
  _onMousemove(event) {
    this._onPointermove(event);
  }
  _onMouseup() {
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._onMousemove);
    window.removeEventListener('mouseup', this._onMouseup);
  }
  _onPointerdown(event) {
    this._onPointermove(event);
  }
  _onPointermoveDebounced(event) {
    const pointer = event.changedTouches ? event.changedTouches[0] : event;
    const rect = this.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (pointer.clientX - rect.x) / rect.width));
    const y = Math.max(0, Math.min(1, (pointer.clientY - rect.y) / rect.height));
    this._setValue(x, y);
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    this.dispatchEvent('value-set', {property: 'value', value: this.value}, false);
    this.valueChanged();
    this.changed();
  }
  _onPointermove(event) {
    this.debounce(this._onPointermoveDebounced, event);
  }
  _setValue(x, y) {
    x, y;
    // NOTE: implement in subclass
  }
}

IoColorSlider.Register();
