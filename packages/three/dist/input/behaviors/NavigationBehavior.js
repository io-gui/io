import { BehaviorPriority } from '../Behavior.js';
import { navigationKeymaps } from '../Keymap.js';
const DRAG_ACTIONS = ['view.orbit', 'view.pan', 'view.dolly'];
const WHEEL_ZOOM_BASE = 0.95;
const DRAG_DOLLY_SPEED = 0.005;
/**
 * Camera navigation as a router behavior (ADR-0004, ADR-0005). Bindings come from a keymap; every
 * gesture edits `view.navigation` and tags only this view. Touch: one finger runs the bound drag action,
 * two fingers pan and pinch-dolly. Disabled while the view looks through a scene camera.
 */
export class NavigationBehavior {
    priority = BehaviorPriority.navigation;
    keymap;
    /** Axis views do not orbit; an orbit gesture pans instead (Maya and Houdini behave the same). */
    lockAxisViews = true;
    _host;
    _pending = null;
    _action = null;
    _pointers = new Map();
    _pinch = null;
    constructor(host, keymap = navigationKeymaps.default) {
        this._host = host;
        this.keymap = keymap;
    }
    _isEnabled() {
        const view = this._host.view;
        return !!view && !view.getSourceCamera(this._host.scene);
    }
    wantsCapture(event) {
        if (!this._isEnabled())
            return false;
        const entry = this.keymap.match(event, action => event.type === 'wheel' ? action === 'view.zoom' : DRAG_ACTIONS.includes(action));
        this._pending = entry;
        return !!entry;
    }
    begin(event) {
        if (event.type === 'wheel') {
            this._zoom(event);
            return;
        }
        let action = this._pending.action;
        if (action === 'view.orbit' && this.lockAxisViews && event.view.navigation.axisView)
            action = 'view.pan';
        this._action = action;
        this._pointers.set(event.pointerId, { x: event.x, y: event.y });
    }
    update(event) {
        switch (event.type) {
            case 'wheel':
                this._zoom(event);
                return;
            case 'pointerdown':
                this._pointers.set(event.pointerId, { x: event.x, y: event.y });
                if (this._pointers.size === 2)
                    this._pinch = this._measurePinch();
                return;
            case 'pointerup':
                this._pointers.delete(event.pointerId);
                if (this._pointers.size < 2)
                    this._pinch = null;
                return;
            case 'pointermove':
                this._pointers.set(event.pointerId, { x: event.x, y: event.y });
                if (this._pinch)
                    this._updatePinch(event);
                else
                    this._drag(event);
                return;
        }
    }
    end() {
        this._reset();
    }
    cancel() {
        this._reset();
    }
    key(event) {
        if (event.type !== 'keydown' || !this._isEnabled())
            return false;
        const entry = this.keymap.match(event, action => action === 'view.frameAll' || action === 'view.axis');
        if (!entry)
            return false;
        const view = event.view;
        if (entry.action === 'view.frameAll') {
            const scene = this._host.scene;
            if (scene)
                view.frame(scene);
        }
        else {
            view.setAxisView(entry.props?.axis ?? null);
        }
        return true;
    }
    _reset() {
        this._action = null;
        this._pending = null;
        this._pinch = null;
        this._pointers.clear();
    }
    _drag(event) {
        if (!this._action || (event.dx === 0 && event.dy === 0))
            return;
        const view = event.view;
        const nav = view.navigation;
        const height = event.height || 1;
        switch (this._action) {
            case 'view.orbit':
                nav.orbit(-2 * Math.PI * event.dx / height, -2 * Math.PI * event.dy / height);
                break;
            case 'view.pan':
                nav.pan(event.dx, event.dy, view.getWorldPerPixel(event.width, event.height, this._host.scene));
                break;
            case 'view.dolly':
                nav.dolly(Math.exp(event.dy * DRAG_DOLLY_SPEED));
                break;
        }
        view.markNavigationChanged();
    }
    _zoom(event) {
        if (event.deltaY === 0)
            return;
        event.view.navigation.dolly(Math.pow(WHEEL_ZOOM_BASE, -event.deltaY * 0.01));
        event.view.markNavigationChanged();
    }
    _measurePinch() {
        const [a, b] = [...this._pointers.values()];
        return { distance: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    _updatePinch(event) {
        const next = this._measurePinch();
        const previous = this._pinch;
        const view = event.view;
        const nav = view.navigation;
        nav.pan(next.x - previous.x, next.y - previous.y, view.getWorldPerPixel(event.width, event.height, this._host.scene));
        if (next.distance > 0 && previous.distance > 0)
            nav.dolly(previous.distance / next.distance);
        this._pinch = next;
        view.markNavigationChanged();
    }
}
