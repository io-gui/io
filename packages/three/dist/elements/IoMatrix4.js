var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { IoMatrixBase } from './IoMatrixBase.js';
let IoMatrix4 = class IoMatrix4 extends IoMatrixBase {
    static get Style() {
        return /* css */ `
      :host {
        grid-template-columns: repeat(4, 1fr);
      }
    `;
    }
};
IoMatrix4 = __decorate([
    Register
], IoMatrix4);
export { IoMatrix4 };
export const ioMatrix4 = function (arg0) {
    return IoMatrix4.vConstructor(arg0);
};
//# sourceMappingURL=IoMatrix4.js.map