var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { ThreeMatrixBase } from './ThreeMatrixBase.js';
let ThreeMatrix3 = class ThreeMatrix3 extends ThreeMatrixBase {
    static get Style() {
        return /* css */ `
      :host {
        grid-template-columns: repeat(3, 1fr);
      }
    `;
    }
};
ThreeMatrix3 = __decorate([
    Register
], ThreeMatrix3);
export { ThreeMatrix3 };
export const threeMatrix3 = function (arg0) {
    return ThreeMatrix3.vConstructor(arg0);
};
