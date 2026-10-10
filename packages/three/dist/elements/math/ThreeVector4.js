var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, Field } from '@io-gui/core';
import { Vector4 } from 'three/webgpu';
import { ThreeVectorBase } from './ThreeVectorBase.js';
let ThreeVector4 = class ThreeVector4 extends ThreeVectorBase {
    constructor(args) {
        super(args);
    }
};
__decorate([
    Property({ type: Vector4, init: null })
], ThreeVector4.prototype, "value", void 0);
__decorate([
    Field(['x', 'y', 'z', 'w'])
], ThreeVector4.prototype, "keys", void 0);
ThreeVector4 = __decorate([
    Register
], ThreeVector4);
export { ThreeVector4 };
export const threeVector4 = function (arg0) {
    return ThreeVector4.vConstructor(arg0);
};
