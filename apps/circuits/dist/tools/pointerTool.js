var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register } from '@io-gui/core';
import { ToolBase } from '@io-gui/three';
let PointerTool = class PointerTool extends ToolBase {
    on3DPointerDown(pointers) {
        this.dispatch('3dpointer-down', pointers, true);
    }
    on3DPointerMove(pointers) {
        this.dispatch('3dpointer-move', pointers, true);
    }
    on3DPointerUp(pointers) {
        this.dispatch('3dpointer-up', pointers, true);
    }
    on3DPointerCancel(pointers) {
        this.dispatch('3dpointer-cancel', pointers, true);
    }
};
PointerTool = __decorate([
    Register
], PointerTool);
export { PointerTool };
//# sourceMappingURL=pointerTool.js.map