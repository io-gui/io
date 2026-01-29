var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveProperty, Property } from '@io-gui/core';
import { Vector2 } from 'three/webgpu';
import { IoVectorBase } from './IoVectorBase.js';
let IoVector2 = class IoVector2 extends IoVectorBase {
    constructor(args) {
        super(args);
    }
};
__decorate([
    ReactiveProperty({ type: Vector2, init: null })
], IoVector2.prototype, "value", void 0);
__decorate([
    Property(['x', 'y'])
], IoVector2.prototype, "keys", void 0);
IoVector2 = __decorate([
    Register
], IoVector2);
export { IoVector2 };
export const ioVector2 = function (arg0) {
    return IoVector2.vConstructor(arg0);
};
//# sourceMappingURL=IoVector2.js.map