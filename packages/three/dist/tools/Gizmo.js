import { Group } from 'three/webgpu';
import { BehaviorPriority } from '../input/Behavior.js';
/** Pointer distance in CSS pixels within which a gizmo can be hovered and pressed. */
export const GIZMO_HIT_RADIUS = 8;
/**
 * The gizmos of one viewport: an input behavior in the gizmo band (ADR-0004) and an overlay that draws them.
 * Hovering highlights a gizmo and redraws only overlays; pressing one invokes it, which usually starts a
 * modal operator that takes the pointer from there.
 */
export class GizmoLayer {
    priority = BehaviorPriority.gizmo;
    root = new Group();
    _host;
    _groups = [];
    _hovered = null;
    _pressed = null;
    constructor(host) {
        this._host = host;
        this.root.name = 'GizmoLayer';
    }
    get groups() {
        return this._groups;
    }
    /** Replaces the groups (the active tool's). Old groups are disposed. */
    setGroups(groups) {
        this._setHovered(null);
        for (const group of this._groups) {
            for (const gizmo of group.gizmos)
                this.root.remove(gizmo.object);
            group.dispose();
        }
        this._groups = groups;
        for (const group of groups) {
            for (const gizmo of group.gizmos)
                this.root.add(gizmo.object);
        }
        this._host.tag('overlay');
    }
    // Overlay
    prepare(ctx) {
        const editor = ctx.editor;
        const gizmoContext = { editor, host: this._host, view: ctx.view, camera: ctx.camera, width: ctx.width, height: ctx.height };
        for (const group of this._groups) {
            const visible = group.poll(gizmoContext);
            for (const gizmo of group.gizmos)
                gizmo.object.visible = visible;
            if (!visible)
                continue;
            group.refresh(gizmoContext);
            group.drawPrepare(gizmoContext);
        }
    }
    dispose() {
        this.setGroups([]);
    }
    // Behavior
    hover(event) {
        const gizmo = this._hitTest(event);
        this._setHovered(gizmo);
        return !!gizmo;
    }
    hoverEnd() {
        this._setHovered(null);
    }
    wantsCapture(event) {
        if (event.type !== 'pointerdown' || event.button !== 0)
            return false;
        const { alt, ctrl, meta } = event.modifiers;
        if (alt || ctrl || meta)
            return false;
        this._pressed = this._hitTest(event);
        return !!this._pressed;
    }
    begin(event) {
        const gizmo = this._pressed;
        const ctx = this._context();
        this._pressed = null;
        if (gizmo && ctx)
            gizmo.invoke(ctx, event);
    }
    _context() {
        const editor = this._host.editor;
        if (!editor)
            return null;
        const rect = this._host.getBoundingClientRect();
        return { editor, host: this._host, view: this._host.view, camera: this._host.getViewCamera(), width: rect.width, height: rect.height };
    }
    _hitTest(event) {
        const ctx = this._context();
        if (!ctx)
            return null;
        let best = null;
        let bestDistance = GIZMO_HIT_RADIUS;
        for (const group of this._groups) {
            if (!group.poll(ctx))
                continue;
            group.refresh(ctx);
            group.drawPrepare(ctx);
            for (const gizmo of group.gizmos) {
                const distance = gizmo.hitTest(ctx, event.x, event.y);
                if (distance <= bestDistance) {
                    best = gizmo;
                    bestDistance = distance;
                }
            }
        }
        return best;
    }
    _setHovered(gizmo) {
        if (gizmo === this._hovered)
            return;
        if (this._hovered)
            this._hovered.highlight = false;
        this._hovered = gizmo;
        if (gizmo)
            gizmo.highlight = true;
        this._host.tag('overlay');
    }
}
