var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { IoMatrixBase } from './IoMatrixBase.js';
let IoMatrix3 = class IoMatrix3 extends IoMatrixBase {
    static get Style() {
        return /* css */ `
      :host {
        grid-template-columns: repeat(3, 1fr);
      }
    `;
    }
};
IoMatrix3 = __decorate([
    Register
], IoMatrix3);
export { IoMatrix3 };
export const ioMatrix3 = function (arg0) {
    return IoMatrix3.vConstructor(arg0);
};
//# sourceMappingURL=IoMatrix3.js.map