var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveNode, Register } from '@io-gui/core';
import { Vector2, Ray, Raycaster } from 'three/webgpu';
const _raycaster = new Raycaster();
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
    _activePointers = {};
    _onPointerDown(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.target;
        viewport.setPointerCapture(event.pointerId);
        const pointer3D = this.pointerTo3D(event);
        this._activePointers[event.pointerId] = pointer3D;
        this.on3DPointerDown(Object.values(this._activePointers));
    }
    _onPointerMove(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!this._activePointers[event.pointerId])
            return;
        const pointer3D = this.pointerTo3D(event);
        this._activePointers[event.pointerId] = pointer3D;
        this.on3DPointerMove(Object.values(this._activePointers));
    }
    _onPointerUp(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.target;
        viewport.releasePointerCapture(event.pointerId);
        if (!this._activePointers[event.pointerId])
            return;
        delete this._activePointers[event.pointerId];
        this.on3DPointerUp(Object.values(this._activePointers));
    }
    _onPointerCancel(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.target;
        viewport.releasePointerCapture(event.pointerId);
        if (!this._activePointers[event.pointerId])
            return;
        delete this._activePointers[event.pointerId];
        this.on3DPointerCancel(Object.values(this._activePointers));
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
    pointerTo3D(event) {
        const _viewport = event.target;
        const _rect = _viewport.getBoundingClientRect();
        const screen = new Vector2(((event.clientX - _rect.left) / _rect.width) * 2 - 1, -((event.clientY - _rect.top) / _rect.height) * 2 + 1);
        _viewport.viewCameras.setOverscan(_viewport.width, _viewport.height, _viewport.overscan);
        const camera = _viewport.viewCameras.camera;
        _raycaster.setFromCamera(screen, camera);
        _viewport.viewCameras.resetOverscan();
        const { origin, direction } = _raycaster.ray;
        const previousPointer3D = this._activePointers[event.pointerId];
        if (previousPointer3D) {
            return {
                event,
                screen,
                screenStart: previousPointer3D.screenStart.clone(),
                screenMovement: screen.clone().sub(previousPointer3D.screen),
                ray: new Ray(origin.clone(), direction.clone()),
                rayStart: new Ray(previousPointer3D.rayStart.origin.clone(), previousPointer3D.rayStart.direction.clone()),
                rayMovement: new Ray(origin.clone().sub(previousPointer3D.ray.origin), direction.clone().sub(previousPointer3D.ray.direction)),
            };
        }
        else {
            return {
                event,
                screen,
                screenStart: screen.clone(),
                screenMovement: new Vector2(0, 0),
                ray: new Ray(origin.clone(), direction.clone()),
                rayStart: new Ray(origin.clone(), direction.clone()),
                rayMovement: new Ray(origin.clone(), direction.clone()),
            };
        }
    }
};
ToolBase = __decorate([
    Register
], ToolBase);
export { ToolBase };
//# sourceMappingURL=ToolBase.js.map