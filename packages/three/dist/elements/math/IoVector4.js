var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, Property } from '@io-gui/core';
import { Vector4 } from 'three/webgpu';
import { IoVectorBase } from './IoVectorBase.js';
let IoVector4 = class IoVector4 extends IoVectorBase {
    constructor(args) {
        super(args);
    }
};
__decorate([
    ReactiveProperty({ type: Vector4, init: null })
], IoVector4.prototype, "value", void 0);
__decorate([
    Property(['x', 'y', 'z', 'w'])
], IoVector4.prototype, "keys", void 0);
IoVector4 = __decorate([
    Register
], IoVector4);
export { IoVector4 };
export const ioVector4 = function (arg0) {
    return IoVector4.vConstructor(arg0);
};
//# sourceMappingURL=IoVector4.js.map