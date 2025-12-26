var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Node, ReactiveProperty } from '@io-gui/core';
import { Scene } from 'three/webgpu';
let ThreeState = class ThreeState extends Node {
    renderer = null;
    width = 0;
    height = 0;
    setViewportSize(width, height) {
        if (this.width !== width || this.height !== height) {
            if (!!width && !!height) {
                this.width = width;
                this.height = height;
                this.onResized(width, height);
            }
        }
    }
    isRendererInitialized() {
        return !!this.renderer && this.renderer.initialized === true;
    }
    onRendererInitialized(renderer) {
        this.renderer = renderer;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResized(width, height) { }
    onAnimate() { }
};
__decorate([
    ReactiveProperty({ type: Scene, init: null })
], ThreeState.prototype, "scene", void 0);
ThreeState = __decorate([
    Register
], ThreeState);
export { ThreeState };
//# sourceMappingURL=ThreeState.js.map