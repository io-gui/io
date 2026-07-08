var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveObject, Register, Property } from '@io-gui/core';
import { Vector2, Ray, Raycaster } from 'three/webgpu';
import { ThreeApplet } from './ThreeApplet';
const _raycaster = new Raycaster();
let ToolBase = class ToolBase extends ReactiveObject {
    _viewports = [];
    _activePointers = new WeakMap();
    _hoverPointers = new WeakMap();
    constructor(args) {
        super(args);
    }
    registerViewport(viewport) {
        if (this._viewports.includes(viewport))
            return;
        this._viewports.push(viewport);
        viewport.addEventListener('contextmenu', this._onContextMenu);
        viewport.addEventListener('pointerdown', this._onPointerDown);
        viewport.addEventListener('pointermove', this._onPointerMove);
        viewport.addEventListener('pointerleave', this._onPointerLeave);
        viewport.addEventListener('pointerout', this._onPointerOut);
        viewport.addEventListener('pointerup', this._onPointerUp);
        viewport.addEventListener('pointercancel', this._onPointerCancel);
        viewport.addEventListener('lostpointercapture', this._onLostPointerCapture);
    }
    unregisterViewport(viewport) {
        if (!this._viewports.includes(viewport))
            return;
        this._viewports.splice(this._viewports.indexOf(viewport), 1);
        viewport.removeEventListener('contextmenu', this._onContextMenu);
        viewport.removeEventListener('pointerdown', this._onPointerDown);
        viewport.removeEventListener('pointermove', this._onPointerMove);
        viewport.removeEventListener('pointerleave', this._onPointerLeave);
        viewport.removeEventListener('pointerout', this._onPointerOut);
        viewport.removeEventListener('pointerup', this._onPointerUp);
        viewport.removeEventListener('pointercancel', this._onPointerCancel);
        viewport.removeEventListener('lostpointercapture', this._onLostPointerCapture);
        this._activePointers.delete(viewport);
        this._hoverPointers.delete(viewport);
    }
    _onContextMenu(event) {
        event.stopPropagation();
        event.preventDefault();
    }
    _onPointerDown(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        viewport.setPointerCapture(event.pointerId);
        const pointer3D = this.pointerTo3D(event);
        delete hoverPointers[event.pointerId];
        activePointers[event.pointerId] = pointer3D;
        this.on3DPointerDown(pointer3D, Object.values(activePointers), viewport);
    }
    _onPointerMove(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        const pointer3D = this.pointerTo3D(event);
        if (!activePointers[event.pointerId]) {
            hoverPointers[event.pointerId] = pointer3D;
            this.on3DPointerHover(pointer3D, Object.values(hoverPointers), viewport);
        }
        else {
            activePointers[event.pointerId] = pointer3D;
            this.on3DPointerMove(pointer3D, Object.values(activePointers), viewport);
        }
    }
    _onPointerUp(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const pointer3D = this.pointerTo3D(event);
        viewport.releasePointerCapture(event.pointerId);
        if (!activePointers[event.pointerId])
            return;
        this.on3DPointerUp(pointer3D, Object.values(activePointers), viewport);
        delete activePointers[event.pointerId];
    }
    _onPointerCancel(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        const pointer3D = this.pointerTo3D(event);
        viewport.releasePointerCapture(event.pointerId);
        this.on3DPointerCancel(pointer3D, Object.values(activePointers), viewport);
        delete hoverPointers[event.pointerId];
        delete activePointers[event.pointerId];
    }
    _onPointerLeave(event) {
        const viewport = event.currentTarget;
        if (this._removeHoverPointer(viewport, event.pointerId)) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    _onPointerOut(event) {
        const viewport = event.currentTarget;
        if (this._removeHoverPointer(viewport, event.pointerId)) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    _onLostPointerCapture(event) {
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        delete hoverPointers[event.pointerId];
        delete activePointers[event.pointerId];
        event.stopPropagation();
        event.preventDefault();
    }
    on3DPointerHover(pointer, pointers, viewport) {
        console.log('on3DPointerHover', pointer, pointers, viewport);
    }
    on3DPointerDown(pointer, pointers, viewport) {
        console.log('on3DPointerDown', pointer, pointers, viewport);
    }
    on3DPointerMove(pointer, pointers, viewport) {
        console.log('on3DPointerMove', pointer, pointers, viewport);
    }
    on3DPointerUp(pointer, pointers, viewport) {
        console.log('on3DPointerUp', pointer, pointers, viewport);
    }
    on3DPointerCancel(pointer, pointers, viewport) {
        console.log('on3DPointerCancel', pointer, pointers, viewport);
    }
    _getActivePointers(viewport) {
        let activePointers = this._activePointers.get(viewport);
        if (!activePointers) {
            activePointers = {};
            this._activePointers.set(viewport, activePointers);
        }
        return activePointers;
    }
    _getHoverPointers(viewport) {
        let hoverPointers = this._hoverPointers.get(viewport);
        if (!hoverPointers) {
            hoverPointers = {};
            this._hoverPointers.set(viewport, hoverPointers);
        }
        return hoverPointers;
    }
    _removeHoverPointer(viewport, pointerId) {
        const hoverPointers = this._getHoverPointers(viewport);
        if (!hoverPointers[pointerId])
            return false;
        delete hoverPointers[pointerId];
        return true;
    }
    pointerTo3D(event) {
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        const _rect = viewport.getBoundingClientRect();
        const screen = new Vector2(((event.clientX - _rect.left) / _rect.width) * 2 - 1, -((event.clientY - _rect.top) / _rect.height) * 2 + 1);
        viewport.viewCameras.setOverscan(viewport.width, viewport.height, viewport.overscan);
        const camera = viewport.viewCameras.camera;
        _raycaster.setFromCamera(screen, camera);
        viewport.viewCameras.resetOverscan();
        const { origin, direction } = _raycaster.ray;
        const previousPointer3D = activePointers[event.pointerId] || hoverPointers[event.pointerId];
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
__decorate([
    Property({ type: ThreeApplet })
], ToolBase.prototype, "applet", void 0);
ToolBase = __decorate([
    Register
], ToolBase);
export { ToolBase };
