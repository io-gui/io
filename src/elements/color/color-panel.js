import {html, IoElement} from "../../io.js";
import {IoLayerSingleton, IoThemeSingleton as mixin} from "../../io-elements-core.js";
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
      :host > * {
        border-radius: calc(var(--io-border-radius) - var(--io-border-width));
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
  _onHsvSet() {
    this.setValueFromHsv();
    this._suspendLoop = true;
    this.dispatchEvent('object-mutated', {object: this.value}, false, window);
    setTimeout(()=> {
      this._suspendLoop = false;
    });
  }
  expandedChanged() {
    this.valueChanged();
  }
  changed() {
    this.template([
      ['io-color-slider-sv', {value: this.hsv, mode: 1, 'on-value-set': this._onHsvSet}],
      ['io-color-slider-hue', {value: this.hsv, mode: 1, horizontal: !this.horizontal, 'on-value-set': this._onHsvSet}],
      this.alpha !== undefined ? ['io-color-slider-alpha', {value: this.value, horizontal: !this.horizontal}] : null,
    ]);
  }
}

IoColorPanel.Register();

export const IoColorPanelSingleton = new IoColorPanel();
IoLayerSingleton.appendChild(IoColorPanelSingleton);
IoColorPanelSingleton.addEventListener('expanded-changed', IoLayerSingleton.onChildExpanded);
