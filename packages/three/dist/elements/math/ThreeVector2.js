var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, Field } from '@io-gui/core';
import { Vector2 } from 'three/webgpu';
import { ThreeVectorBase } from './ThreeVectorBase.js';
let ThreeVector2 = class ThreeVector2 extends ThreeVectorBase {
    constructor(args) {
        super(args);
    }
};
__decorate([
    Property({ type: Vector2, init: null })
], ThreeVector2.prototype, "value", void 0);
__decorate([
    Field(['x', 'y'])
], ThreeVector2.prototype, "keys", void 0);
ThreeVector2 = __decorate([
    Register
], ThreeVector2);
export { ThreeVector2 };
export const threeVector2 = function (arg0) {
    return ThreeVector2.vConstructor(arg0);
};
