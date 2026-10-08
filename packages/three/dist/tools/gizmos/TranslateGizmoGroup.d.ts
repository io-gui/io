import { Vector3 } from 'three/webgpu';
import type { Gizmo, GizmoContext, GizmoGroup } from '../Gizmo.js';
/** Arrow length in CSS pixels. */
export declare const TRANSLATE_GIZMO_SIZE = 90;
/**
 * Move gizmo: X / Y / Z arrows that move along one world axis and a center handle that moves in the view
 * plane. Sits at the median of the selected objects and keeps a constant size on screen. Pressing a handle
 * starts the modal `transform.translate` operator. Shown in object mode when something is selected.
 */
export declare class TranslateGizmoGroup implements GizmoGroup {
    readonly id = "transform.translate";
    readonly gizmos: readonly Gizmo[];
    /** World position the handles sit at. */
    readonly pivot: Vector3;
    /** World length of an arrow at the current zoom. */
    scale: number;
    private readonly _handles;
    constructor();
    poll(ctx: GizmoContext): boolean;
    refresh(ctx: GizmoContext): void;
    drawPrepare(ctx: GizmoContext): void;
    dispose(): void;
}
