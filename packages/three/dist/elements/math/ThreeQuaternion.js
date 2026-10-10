var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, Field } from '@io-gui/core';
import { Quaternion } from 'three/webgpu';
import { ThreeVectorBase } from './ThreeVectorBase.js';
let ThreeQuaternion = class ThreeQuaternion extends ThreeVectorBase {
    constructor(args) {
        super(args);
    }
};
__decorate([
    Property({ type: Quaternion, init: null })
], ThreeQuaternion.prototype, "value", void 0);
__decorate([
    Field(['x', 'y', 'z', 'w'])
], ThreeQuaternion.prototype, "keys", void 0);
ThreeQuaternion = __decorate([
    Register
], ThreeQuaternion);
export { ThreeQuaternion };
export const threeQuaternion = function (arg0) {
    return ThreeQuaternion.vConstructor(arg0);
};
