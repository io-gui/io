import { Raycaster, Vector2 } from 'three/webgpu';
const _raycaster = new Raycaster();
/**
 * One input event in view terms: pixel and normalized coordinates inside the viewport,
 * movement since this pointer's previous event, and a ray built on demand.
 */
export class ViewInputEvent {
    type;
    native;
    host;
    /** Pixels from the viewport's left / top edge. */
    x;
    y;
    /** Viewport size in CSS pixels. */
    width;
    height;
    /** Pixels moved since this pointer's previous event. */
    dx;
    dy;
    /** Normalized device coordinates, -1..1, y up. */
    screen;
    button;
    pointerId;
    pointerType;
    modifiers;
    /** Wheel delta in pixels (line and page modes converted). */
    deltaY;
    /** `KeyboardEvent.code` for key events. */
    code;
    _ray = null;
    constructor(type, native, host, rect, previous) {
        this.type = type;
        this.native = native;
        this.host = host;
        const mouse = native;
        const hasPosition = typeof mouse.clientX === 'number';
        this.x = hasPosition ? mouse.clientX - rect.left : 0;
        this.y = hasPosition ? mouse.clientY - rect.top : 0;
        this.width = rect.width;
        this.height = rect.height;
        this.dx = previous ? this.x - previous.x : 0;
        this.dy = previous ? this.y - previous.y : 0;
        this.screen = new Vector2(rect.width ? (this.x / rect.width) * 2 - 1 : 0, rect.height ? -(this.y / rect.height) * 2 + 1 : 0);
        this.button = typeof mouse.button === 'number' ? mouse.button : -1;
        this.pointerId = typeof mouse.pointerId === 'number' ? mouse.pointerId : -1;
        this.pointerType = mouse.pointerType ?? '';
        this.modifiers = { shift: native.shiftKey, ctrl: native.ctrlKey, alt: native.altKey, meta: native.metaKey };
        const wheel = native;
        this.deltaY = type === 'wheel' ? wheel.deltaY * (wheel.deltaMode === 1 ? 16 : wheel.deltaMode === 2 ? rect.height : 1) : 0;
        this.code = native.code ?? '';
    }
    get view() {
        return this.host.view;
    }
    /** World-space ray under the pointer, from the view's draw camera. */
    getRay() {
        if (!this._ray) {
            _raycaster.setFromCamera(this.screen, this.host.getViewCamera());
            this._ray = _raycaster.ray.clone();
        }
        return this._ray;
    }
}
