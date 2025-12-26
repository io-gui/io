var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, div } from 'io-core';
import { IoColorBase } from './IoColorBase.js';
/**
 * Element displaying colored square.
 *
 * <io-element-demo element="io-color-swatch"
 * properties='{"value": [1, 0.5, 0, 1]}'
 * config='{"value": ["io-property-editor"]}
 * '></io-element-demo>
 **/
let IoColorSwatch = class IoColorSwatch extends IoColorBase {
    static get Style() {
        return /* css */ `
      :host {
        display: inline-block;
        min-width: var(--io_fieldHeight);
        height: var(--io_fieldHeight);
        background-color: white;
        background-image: linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%);
        background-size: 12px 12px;
        background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
        overflow: visible;
      }
      :host > div { 
        width: 100%;
        height: 100%;
      }
    `;
    }
    valueChanged() {
        super.valueChanged();
        this.render([
            div({ style: { 'background-color': `rgba(${this.rgba[0] * 255},${this.rgba[1] * 255}, ${this.rgba[2] * 255}, ${this.rgba[3]})` } })
        ]);
    }
};
IoColorSwatch = __decorate([
    Register
], IoColorSwatch);
export { IoColorSwatch };
export const ioColorSwatch = function (arg0) {
    return IoColorSwatch.vConstructor(arg0);
};
//# sourceMappingURL=IoColorSwatch.js.map