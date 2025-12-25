var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Node, ReactiveProperty } from 'io-core';
import { Camera, Scene } from 'three/build/three.webgpu.js';
let ThreeState = class ThreeState extends Node {
};
__decorate([
    ReactiveProperty({ value: null, type: Scene })
], ThreeState.prototype, "scene", void 0);
__decorate([
    ReactiveProperty({ value: null, type: Camera })
], ThreeState.prototype, "camera", void 0);
ThreeState = __decorate([
    Register
], ThreeState);
export { ThreeState };
//# sourceMappingURL=ThreeStateBase.js.map