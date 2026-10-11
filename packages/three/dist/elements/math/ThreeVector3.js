var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, Field } from '@io-gui/core';
import { Vector3 } from 'three/webgpu';
import { ThreeVectorBase } from './ThreeVectorBase.js';
let ThreeVector3 = class ThreeVector3 extends ThreeVectorBase {
    constructor(args) {
        super(args);
    }
};
__decorate([
    Property({ type: Vector3, init: null })
], ThreeVector3.prototype, "value", void 0);
__decorate([
    Field(['x', 'y', 'z'])
], ThreeVector3.prototype, "keys", void 0);
ThreeVector3 = __decorate([
    Register
], ThreeVector3);
export { ThreeVector3 };
export const threeVector3 = function (arg0) {
    return ThreeVector3.vConstructor(arg0);
};
