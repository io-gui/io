/* eslint-disable @typescript-eslint/no-unused-vars */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ReactiveObject, Register, Property } from '@io-gui/core';
import { Vector2, Ray, Raycaster, Vector3 } from 'three/webgpu';
import { ThreeApplet } from './ThreeApplet';
import { BehaviorPriority } from '../input/Behavior.js';
const _raycaster = new Raycaster();
/**
 * Adapts a ToolBase to the InputRouter (ADR-0004): one shared behavior at tool priority that forwards
 * router events to the tool's existing pointer handlers. The router dispatches synchronously from the
 * viewport's own listeners, so `event.currentTarget` is still the viewport.
 */
class ToolBaseBehavior {
    tool;
    priority = BehaviorPriority.tool;
    constructor(tool) {
        this.tool = tool;
    }
    wantsCapture(event) {
        return (event.type === 'pointerdown' || event.type === 'wheel') && this.tool.capturesInput(event.native);
    }
    begin(event) {
        if (event.type === 'wheel')
            this.tool._onWheel(event.native);
        else
            this.tool._onPointerDown(event.native);
    }
    update(event) {
        switch (event.type) {
            case 'pointerdown':
                this.tool._onPointerDown(event.native);
                break;
            case 'pointermove':
                this.tool._onPointerMove(event.native);
                break;
            case 'pointerup':
                this.tool._onPointerUp(event.native);
                break;
            case 'wheel':
                this.tool._onWheel(event.native);
                break;
        }
    }
    end(event) {
        if (event.type === 'pointerup')
            this.tool._onPointerUp(event.native);
    }
    cancel(event) {
        if (event?.type === 'pointercancel')
            this.tool._onPointerCancel(event.native);
        else if (event)
            this.tool._resetPointers(event.host);
    }
    hover(event) {
        // Tools track hover passively and never block lower behaviors.
        this.tool._onPointerMove(event.native);
        return false;
    }
    hoverEnd(event) {
        if (event)
            this.tool._onPointerLeave(event.native);
    }
}
let ToolBase = class ToolBase extends ReactiveObject {
    _viewports = [];
    _activePointers = new WeakMap();
    _hoverPointers = new WeakMap();
    _behavior = new ToolBaseBehavior(this);
    constructor(args) {
        super(args);
    }
    /** The behavior this tool adds to each registered viewport's InputRouter. */
    get behavior() {
        return this._behavior;
    }
    registerViewport(viewport) {
        if (this._viewports.includes(viewport))
            return;
        this._viewports.push(viewport);
        viewport.inputRouter.add(this._behavior);
    }
    unregisterViewport(viewport) {
        if (!this._viewports.includes(viewport))
            return;
        this._viewports.splice(this._viewports.indexOf(viewport), 1);
        viewport.inputRouter.remove(this._behavior);
        this._resetPointers(viewport);
    }
    /**
     * Whether this tool captures a press or wheel event. Defaults to everything, so lower-priority behaviors
     * (camera navigation) only get input the tool lets through. Override to share, for example
     * `return event.button === 0` to leave other buttons and the wheel to navigation.
     */
    capturesInput(event) {
        return true;
    }
    _resetPointers(viewport) {
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
        this._removePointer(hoverPointers, event.pointerId);
        this._setPointer(activePointers, pointer3D);
        this.on3DPointerDown(pointer3D, activePointers, viewport);
    }
    _onPointerMove(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        const pointer3D = this.pointerTo3D(event);
        if (!this._findPointer(activePointers, event.pointerId)) {
            this._setPointer(hoverPointers, pointer3D);
            this.on3DPointerHover(pointer3D, hoverPointers, viewport);
        }
        else {
            this._setPointer(activePointers, pointer3D);
            this.on3DPointerMove(pointer3D, activePointers, viewport);
        }
    }
    _onPointerUp(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const pointer3D = this.pointerTo3D(event);
        viewport.releasePointerCapture(event.pointerId);
        if (!this._findPointer(activePointers, event.pointerId))
            return;
        this.on3DPointerUp(pointer3D, activePointers, viewport);
        this._removePointer(activePointers, event.pointerId);
    }
    _onPointerCancel(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        const pointer3D = this.pointerTo3D(event);
        viewport.releasePointerCapture(event.pointerId);
        this.on3DPointerCancel(pointer3D, activePointers, viewport);
        this._removePointer(hoverPointers, event.pointerId);
        this._removePointer(activePointers, event.pointerId);
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
        this._removePointer(hoverPointers, event.pointerId);
        this._removePointer(activePointers, event.pointerId);
        event.stopPropagation();
        event.preventDefault();
    }
    _onWheel(event) {
        event.stopPropagation();
        event.preventDefault();
        const viewport = event.currentTarget;
        const pointer3D = this.pointerTo3D(event); // TODO: Fix type
        this.on3DWheel(pointer3D, event, viewport);
    }
    on3DPointerHover(pointer, pointers, viewport) {
        // console.log('on3DPointerHover', pointer, pointers, viewport)
    }
    on3DPointerDown(pointer, pointers, viewport) {
        // console.log('on3DPointerDown', pointer, pointers, viewport)
    }
    on3DPointerMove(pointer, pointers, viewport) {
        // console.log('on3DPointerMove', pointer, pointers, viewport)
    }
    on3DPointerUp(pointer, pointers, viewport) {
        // console.log('on3DPointerUp', pointer, pointers, viewport)
    }
    on3DPointerCancel(pointer, pointers, viewport) {
        // console.log('on3DPointerCancel', pointer, pointers, viewport)
    }
    on3DWheel(pointer, event, viewport) {
        // console.log('on3DWheel', pointer, event, viewport)
    }
    _getActivePointers(viewport) {
        let activePointers = this._activePointers.get(viewport);
        if (!activePointers) {
            activePointers = [];
            this._activePointers.set(viewport, activePointers);
        }
        return activePointers;
    }
    _getHoverPointers(viewport) {
        let hoverPointers = this._hoverPointers.get(viewport);
        if (!hoverPointers) {
            hoverPointers = [];
            this._hoverPointers.set(viewport, hoverPointers);
        }
        return hoverPointers;
    }
    _findPointer(pointers, pointerId) {
        return pointers.find(pointer => pointer.event.pointerId === pointerId);
    }
    _setPointer(pointers, pointer3D) {
        const index = pointers.findIndex(pointer => pointer.event.pointerId === pointer3D.event.pointerId);
        if (index === -1) {
            pointers.push(pointer3D);
        }
        else {
            pointers[index] = pointer3D;
        }
    }
    _removePointer(pointers, pointerId) {
        const index = pointers.findIndex(pointer => pointer.event.pointerId === pointerId);
        if (index === -1)
            return false;
        pointers.splice(index, 1);
        return true;
    }
    _removeHoverPointer(viewport, pointerId) {
        return this._removePointer(this._getHoverPointers(viewport), pointerId);
    }
    pointerTo3D(event) {
        const viewport = event.currentTarget;
        const activePointers = this._getActivePointers(viewport);
        const hoverPointers = this._getHoverPointers(viewport);
        const _rect = viewport.getBoundingClientRect();
        const screen = new Vector2(((event.clientX - _rect.left) / _rect.width) * 2 - 1, -((event.clientY - _rect.top) / _rect.height) * 2 + 1);
        _raycaster.setFromCamera(screen, viewport.getViewCamera());
        const { origin, direction } = _raycaster.ray;
        const previousPointer3D = this._findPointer(activePointers, event.pointerId) || this._findPointer(hoverPointers, event.pointerId);
        if (previousPointer3D) {
            return {
                event,
                screen,
                screenStart: previousPointer3D.screenStart.clone(),
                screenPrevious: previousPointer3D.screen.clone(),
                screenMovement: screen.clone().sub(previousPointer3D.screen),
                ray: new Ray(origin.clone(), direction.clone()),
                rayStart: new Ray(previousPointer3D.rayStart.origin.clone(), previousPointer3D.rayStart.direction.clone()),
                rayPrevious: previousPointer3D.ray.clone(),
                rayMovement: new Ray(origin.clone().sub(previousPointer3D.ray.origin), direction.clone().sub(previousPointer3D.ray.direction)),
            };
        }
        else {
            return {
                event,
                screen,
                screenStart: screen.clone(),
                screenPrevious: screen.clone(),
                screenMovement: new Vector2(0, 0),
                ray: new Ray(origin.clone(), direction.clone()),
                rayStart: new Ray(origin.clone(), direction.clone()),
                rayPrevious: new Ray(origin.clone(), direction.clone()),
                rayMovement: new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0)),
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
