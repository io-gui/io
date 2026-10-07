import { ViewInputEvent } from './ViewInputEvent.js';
const _routers = new Set();
let _hoveredRouter = null;
let _keyListenersInstalled = false;
function setHoveredRouter(router) {
    _hoveredRouter = router;
}
function isEditable(target) {
    const element = target;
    if (!element || !element.tagName)
        return false;
    return element.isContentEditable || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT';
}
function routeKey(type, native) {
    if (native.defaultPrevented || isEditable(native.target))
        return;
    let router = _hoveredRouter;
    if (!router) {
        const active = document.activeElement;
        for (const candidate of _routers) {
            if (active && candidate.host.contains(active)) {
                router = candidate;
                break;
            }
        }
    }
    router?.handleKey(type, native);
}
function installKeyListeners() {
    if (_keyListenersInstalled)
        return;
    _keyListenersInstalled = true;
    document.addEventListener('keydown', (event) => routeKey('keydown', event));
    document.addEventListener('keyup', (event) => routeKey('keyup', event));
}
/**
 * Routes input for one viewport (ADR-0004). It is the only code that listens to the viewport's
 * pointer, wheel and context-menu events and takes pointer capture. Behaviors are offered events in
 * priority order; only events a behavior captured are `preventDefault`ed and stopped.
 * Key events go to the viewport under the pointer, else to the focused one.
 */
export class InputRouter {
    host;
    _behaviors = [];
    _captured = null;
    _capturedPointers = new Set();
    _hovered = null;
    _lastPositions = new Map();
    _suppressContextMenu = false;
    _modal = false;
    constructor(host) {
        this.host = host;
        host.addEventListener('pointerdown', this._onPointerDown);
        host.addEventListener('pointermove', this._onPointerMove);
        host.addEventListener('pointerup', this._onPointerUp);
        host.addEventListener('pointercancel', this._onPointerCancel);
        host.addEventListener('lostpointercapture', this._onPointerCancel);
        host.addEventListener('pointerenter', this._onPointerEnter);
        host.addEventListener('pointerleave', this._onPointerLeave);
        host.addEventListener('wheel', this._onWheel, { passive: false });
        host.addEventListener('contextmenu', this._onContextMenu);
        _routers.add(this);
        installKeyListeners();
    }
    get behaviors() {
        return this._behaviors;
    }
    get captured() {
        return this._captured;
    }
    add(behavior) {
        if (this._behaviors.includes(behavior))
            return;
        this._behaviors.push(behavior);
        // Stable: equal priorities keep insertion order.
        this._behaviors.sort((a, b) => b.priority - a.priority);
    }
    remove(behavior) {
        const index = this._behaviors.indexOf(behavior);
        if (index === -1)
            return;
        if (this._captured === behavior) {
            this._releaseAll();
            behavior.cancel();
        }
        if (this._hovered === behavior) {
            this._hovered = null;
            behavior.hoverEnd?.();
        }
        this._behaviors.splice(index, 1);
    }
    /**
     * Gives every event in this viewport to `behavior` until `endModal(behavior)` (running modal operators).
     * Whatever had captured is cancelled; pointers it held stay captured for the modal behavior.
     */
    startModal(behavior) {
        const previous = this._captured;
        if (previous && previous !== behavior)
            previous.cancel();
        this._endHover();
        this._captured = behavior;
        this._modal = true;
    }
    endModal(behavior) {
        if (this._captured !== behavior || !this._modal)
            return;
        this._modal = false;
        this._releaseAll();
    }
    get isModal() {
        return this._modal;
    }
    handleKey(type, native) {
        const event = this._event(type, native);
        const candidates = this._captured ? [this._captured, ...this._behaviors.filter(b => b !== this._captured)] : this._behaviors;
        for (const behavior of candidates) {
            if (behavior.key?.(event)) {
                native.preventDefault();
                return true;
            }
        }
        return false;
    }
    dispose() {
        if (this._captured) {
            const captured = this._captured;
            this._releaseAll();
            captured.cancel();
        }
        const host = this.host;
        host.removeEventListener('pointerdown', this._onPointerDown);
        host.removeEventListener('pointermove', this._onPointerMove);
        host.removeEventListener('pointerup', this._onPointerUp);
        host.removeEventListener('pointercancel', this._onPointerCancel);
        host.removeEventListener('lostpointercapture', this._onPointerCancel);
        host.removeEventListener('pointerenter', this._onPointerEnter);
        host.removeEventListener('pointerleave', this._onPointerLeave);
        host.removeEventListener('wheel', this._onWheel);
        host.removeEventListener('contextmenu', this._onContextMenu);
        _routers.delete(this);
        if (_hoveredRouter === this)
            _hoveredRouter = null;
        this._behaviors.length = 0;
    }
    _event(type, native) {
        const rect = this.host.getBoundingClientRect();
        const pointerId = native.pointerId;
        const previous = pointerId !== undefined ? this._lastPositions.get(pointerId) : undefined;
        const event = new ViewInputEvent(type, native, this.host, rect, previous);
        if (pointerId !== undefined && type !== 'wheel')
            this._lastPositions.set(pointerId, { x: event.x, y: event.y });
        return event;
    }
    _consume(native) {
        native.preventDefault();
        native.stopPropagation();
    }
    _capture(behavior, event) {
        this._endHover(event);
        this._captured = behavior;
        this._capturePointer(event.pointerId);
        if (event.button === 2)
            this._suppressContextMenu = true;
        // preventDefault on pointerdown stops the browser from focusing; focus explicitly for key routing.
        if (this.host.tabIndex >= 0 && !this.host.contains(document.activeElement))
            this.host.focus({ preventScroll: true });
        this._consume(event.native);
        behavior.begin(event);
    }
    _capturePointer(pointerId) {
        this._capturedPointers.add(pointerId);
        try {
            this.host.setPointerCapture(pointerId);
        }
        catch {
            // Synthetic events in tests have no active pointer.
        }
    }
    _releaseAll() {
        for (const pointerId of this._capturedPointers) {
            try {
                if (this.host.hasPointerCapture(pointerId))
                    this.host.releasePointerCapture(pointerId);
            }
            catch {
                // Pointer already gone.
            }
        }
        this._capturedPointers.clear();
        this._captured = null;
        this._modal = false;
    }
    _endHover(event) {
        if (this._hovered) {
            const hovered = this._hovered;
            this._hovered = null;
            hovered.hoverEnd?.(event);
        }
    }
    _onPointerDown = (native) => {
        this._suppressContextMenu = false;
        const event = this._event('pointerdown', native);
        const captured = this._captured;
        if (captured && this._modal) {
            this._capturePointer(event.pointerId);
            if (event.button === 2)
                this._suppressContextMenu = true;
            this._consume(native);
            captured.update(event);
            return;
        }
        if (captured) {
            if (captured.allowsStealing) {
                const thief = this._behaviors.find(behavior => behavior !== captured && behavior.wantsCapture(event));
                if (thief) {
                    // The thief takes over every captured pointer plus the new one.
                    captured.cancel(event);
                    this._captured = thief;
                    this._capturePointer(event.pointerId);
                    this._consume(native);
                    thief.begin(event);
                    return;
                }
            }
            this._capturePointer(event.pointerId);
            if (event.button === 2)
                this._suppressContextMenu = true;
            this._consume(native);
            captured.update(event);
            return;
        }
        for (const behavior of this._behaviors) {
            if (behavior.wantsCapture(event)) {
                this._capture(behavior, event);
                return;
            }
        }
    };
    _onPointerMove = (native) => {
        const event = this._event('pointermove', native);
        if (this._captured) {
            if (this._modal || this._capturedPointers.has(native.pointerId)) {
                this._consume(native);
                this._captured.update(event);
            }
            return;
        }
        let claimed = null;
        for (const behavior of this._behaviors) {
            if (behavior.hover?.(event)) {
                claimed = behavior;
                break;
            }
        }
        if (claimed !== this._hovered) {
            this._hovered?.hoverEnd?.(event);
            this._hovered = claimed;
        }
    };
    _onPointerUp = (native) => {
        const event = this._event('pointerup', native);
        this._lastPositions.delete(native.pointerId);
        const captured = this._captured;
        if (captured && this._modal) {
            this._consume(native);
            this._releasePointer(native.pointerId);
            captured.update(event);
            return;
        }
        if (!captured || !this._capturedPointers.has(native.pointerId))
            return;
        this._consume(native);
        this._capturedPointers.delete(native.pointerId);
        try {
            if (this.host.hasPointerCapture(native.pointerId))
                this.host.releasePointerCapture(native.pointerId);
        }
        catch {
            // Pointer already gone.
        }
        if (this._capturedPointers.size === 0) {
            this._captured = null;
            captured.end(event);
        }
        else {
            captured.update(event);
        }
    };
    _releasePointer(pointerId) {
        this._capturedPointers.delete(pointerId);
        try {
            if (this.host.hasPointerCapture(pointerId))
                this.host.releasePointerCapture(pointerId);
        }
        catch {
            // Pointer already gone.
        }
    }
    _onPointerCancel = (native) => {
        this._lastPositions.delete(native.pointerId);
        if (this._modal) {
            this._capturedPointers.delete(native.pointerId);
            return;
        }
        const captured = this._captured;
        if (!captured || !this._capturedPointers.has(native.pointerId))
            return;
        const event = this._event('pointercancel', native);
        this._capturedPointers.delete(native.pointerId);
        if (this._capturedPointers.size === 0) {
            this._captured = null;
            captured.cancel(event);
        }
    };
    _onWheel = (native) => {
        const event = this._event('wheel', native);
        if (this._captured) {
            this._consume(native);
            this._captured.update(event);
            return;
        }
        for (const behavior of this._behaviors) {
            if (behavior.wantsCapture(event)) {
                this._consume(native);
                behavior.begin(event);
                behavior.end(event);
                return;
            }
        }
    };
    _onContextMenu = (native) => {
        if (this._suppressContextMenu || this._captured)
            native.preventDefault();
        this._suppressContextMenu = false;
    };
    _onPointerEnter = () => {
        setHoveredRouter(this);
    };
    _onPointerLeave = (native) => {
        if (_hoveredRouter === this)
            _hoveredRouter = null;
        if (this._captured)
            return;
        const event = this._event('pointermove', native);
        this._hovered = null;
        for (const behavior of this._behaviors)
            behavior.hoverEnd?.(event);
    };
}
