var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { ThreeMatrixBase } from './ThreeMatrixBase.js';
let ThreeMatrix4 = class ThreeMatrix4 extends ThreeMatrixBase {
    static get Style() {
        return /* css */ `
      :host {
        grid-template-columns: repeat(4, 1fr);
      }
    `;
    }
};
ThreeMatrix4 = __decorate([
    Register
], ThreeMatrix4);
export { ThreeMatrix4 };
export const threeMatrix4 = function (arg0) {
    return ThreeMatrix4.vConstructor(arg0);
};
