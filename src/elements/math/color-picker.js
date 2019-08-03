import {IoLayerSingleton} from "../../io-elements-core.js";
import {IoColorSwatch} from "./color-swatch.js";
import {IoColorPanelSingleton} from "./color-panel.js";

export class IoColorPicker extends IoColorSwatch {
  static get Attributes() {
    return {
      role: 'slider',
      tabindex: 0,
    };
  }
  static get Properties() {
    return {
      value: [0.5, 0.5, 0.5, 0.5],
      horizontal: false,
    };
  }
  static get Listeners() {
    return {
      'mousedown': '_onMousedown',
      'keydown': '_onKeydown',
    };
  }
  _onMousedown() {
    event.preventDefault();
    this.focus();
    this._expand();
  }
  _onKeydown() {
    this._expand();
  }
  _expand() {
    const hasAlpha = this.value[3] !== undefined || this.value.a !== undefined;
    IoColorPanelSingleton.value = this.value;
    IoColorPanelSingleton.style.width = hasAlpha ? '192px' : '160px';
    IoColorPanelSingleton.style.height = '128px';
    IoColorPanelSingleton.expanded = true;
    IoLayerSingleton.clickblock = true;
    IoLayerSingleton.srcElement = this;
    IoLayerSingleton.setElementPosition(IoColorPanelSingleton, 'bottom', this.getBoundingClientRect());
  }
}

IoColorPicker.Register();
