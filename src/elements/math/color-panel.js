import {html, IoElement} from "../../io.js";
import {IoLayerSingleton, IoThemeSingleton as mixin} from "../../io-elements-core.js";
import {convert} from "../../../lib/color-convert.js";
import {IoColorMixin} from "./color.js";

export class IoColorPanel extends IoColorMixin(IoElement) {
  static get Style() {
    return html`<style>
      :host {
        ${mixin.panel}
      }
      :host {
        display: flex;
        cursor: move;
        align-items: stretch;
        min-width: var(--io-line-height);
        min-height: var(--io-line-height);
        flex-direction: column;
      }
      :host[horizontal] {
        flex-direction: row;
      }
      :host > io-color-slider-sv {
        flex: 1 1;
      }
      :host > *:not(:last-child) {
        margin: 0 0 var(--io-spacing) 0;
      }
      :host[horizontal] > *:not(:last-child) {
        margin: 0 var(--io-spacing) 0 0;
      }
    </style>`;
  }
  static get Attributes() {
    return {
      horizontal: true,
    };
  }
  static get Properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: 1,
      },
    };
  }
  _onHsvSet(event) {
    switch (this.mode) {
      case 0:
        const rgb = convert.hsv.rgb([
          this.hsv[0] * 360,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]);
        this.value[this.components[0]] = rgb[0] / 255;
        this.value[this.components[1]] = rgb[1] / 255;
        this.value[this.components[2]] = rgb[2] / 255;
        break;
      case 3:
        // this.hsv[0] = h;
        const cmyk = convert.rgb.cmyk(convert.hsv.rgb([
          this.hsv[0] * 360,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]));
        this.value[this.components[0]] = cmyk[0] / 100;
        this.value[this.components[1]] = cmyk[1] / 100;
        this.value[this.components[2]] = cmyk[2] / 100;
        this.value[this.components[3]] = cmyk[3] / 100;
        break;
      case 1:
        this.value[this.components[0]] = this.hsv[0];
        this.value[this.components[1]] = this.hsv[1];
        this.value[this.components[2]] = this.hsv[2];
        break;
      case 2:
        const hsl = convert.rgb.hsl(convert.hsv.rgb([
          this.hsv[0] * 100,
          this.hsv[1] * 100,
          this.hsv[2] * 100,
        ]));
        this.value[this.components[0]] = hsl[0] / 100;
        this.value[this.components[1]] = hsl[1] / 100;
        this.value[this.components[2]] = hsl[2] / 100;
        break;
    }
    this._suspendLoop = true;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    setTimeout(()=> {
      this._suspendLoop = false;
    });
  }
  changed() {
    const c = this.components;
    const hasAlpha = this.value[c[3]] !== undefined;
    this.template([
      ['io-color-slider-sv', {value: this.hsv, mode: 1, 'on-value-set': this._onHsvSet}],
      ['io-color-slider-hue', {value: this.hsv, mode: 1, horizontal: !this.horizontal, 'on-value-set': this._onHsvSet}],
      hasAlpha ? ['io-color-slider-alpha', {value: this.value, horizontal: !this.horizontal}] : null,
    ]);
  }
}

IoColorPanel.Register();

export const IoColorPanelSingleton = new IoColorPanel();
IoLayerSingleton.appendChild(IoColorPanelSingleton);
IoColorPanelSingleton.addEventListener('expanded-changed', IoLayerSingleton.onChildExpanded);
