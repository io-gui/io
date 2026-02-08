var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveNode, Register } from '@io-gui/core';
let ToolBase = class ToolBase extends ReactiveNode {
    viewports = [];
    constructor(args) {
        super(args);
    }
    registerViewport(viewport) {
        this.viewports.push(viewport);
        viewport.addEventListener('pointerdown', this._onPointerDown);
        viewport.addEventListener('pointermove', this._onPointerMove);
        viewport.addEventListener('pointerup', this._onPointerUp);
        viewport.addEventListener('pointercancel', this._onPointerCancel);
    }
    unregisterViewport(viewport) {
        this.viewports.splice(this.viewports.indexOf(viewport), 1);
        viewport.removeEventListener('pointerdown', this._onPointerDown);
        viewport.removeEventListener('pointermove', this._onPointerMove);
        viewport.removeEventListener('pointerup', this._onPointerUp);
        viewport.removeEventListener('pointercancel', this._onPointerCancel);
    }
    _activePointers = [];
    _onPointerDown(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.target;
        viewport.setPointerCapture(event.pointerId);
        const pointer3D = viewport.pointerTo3D(event);
        this._activePointers.push(pointer3D);
        this.on3DPointerDown([...this._activePointers]);
    }
    _onPointerMove(event) {
        event.stopPropagation();
        event.preventDefault();
        const index = this._activePointers.findIndex(p => p.event.pointerId === event.pointerId);
        if (index === -1)
            return;
        const viewport = event.target;
        const pointer3D = viewport.pointerTo3D(event);
        this._activePointers[index] = pointer3D;
        this.on3DPointerMove([...this._activePointers]);
    }
    _onPointerUp(event) {
        event.stopPropagation();
        event.preventDefault();
        const index = this._activePointers.findIndex(p => p.event.pointerId === event.pointerId);
        if (index === -1)
            return;
        this._activePointers.splice(index, 1);
        this.on3DPointerUp([...this._activePointers]);
    }
    _onPointerCancel(event) {
        event.stopPropagation();
        event.preventDefault();
        const index = this._activePointers.findIndex(p => p.event.pointerId === event.pointerId);
        if (index === -1)
            return;
        this._activePointers.splice(index, 1);
        this.on3DPointerCancel([...this._activePointers]);
    }
    on3DPointerDown(pointers) {
        console.log('on3DPointerDown', pointers);
    }
    on3DPointerMove(pointers) {
        console.log('on3DPointerMove', pointers);
    }
    on3DPointerUp(pointers) {
        console.log('on3DPointerUp', pointers);
    }
    on3DPointerCancel(pointers) {
        console.log('on3DPointerCancel', pointers);
    }
};
ToolBase = __decorate([
    Register
], ToolBase);
export { ToolBase };
//# sourceMappingURL=ToolBase.js.map