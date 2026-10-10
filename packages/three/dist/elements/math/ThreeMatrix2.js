var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { ThreeMatrixBase } from './ThreeMatrixBase.js';
let ThreeMatrix2 = class ThreeMatrix2 extends ThreeMatrixBase {
    static get Style() {
        return /* css */ `
      :host {
        grid-template-columns: repeat(2, 1fr);
      }
    `;
    }
};
ThreeMatrix2 = __decorate([
    Register
], ThreeMatrix2);
export { ThreeMatrix2 };
export const threeMatrix2 = function (arg0) {
    return ThreeMatrix2.vConstructor(arg0);
};
