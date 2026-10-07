import { Group, Object3D, OrthographicCamera, PerspectiveCamera, Vector3 } from 'three/webgpu';
import type { ThreeEditor } from '../editor/ThreeEditor.js';
import type { ThreeView } from '../view/ThreeView.js';
import type { DirtyReason } from '../render/RenderScheduler.js';
import type { Overlay, OverlayContext } from '../render/Overlay.js';
import { Behavior } from '../input/Behavior.js';
import type { ViewInputEvent } from '../input/ViewInputEvent.js';
import type { OperatorHost } from './Operator.js';
/** Pointer distance in CSS pixels within which a gizmo can be hovered and pressed. */
export declare const GIZMO_HIT_RADIUS = 8;
export interface GizmoContext {
    readonly editor: ThreeEditor;
    readonly host: OperatorHost;
    readonly view: ThreeView;
    readonly camera: PerspectiveCamera | OrthographicCamera;
    /** CSS pixels. */
    readonly width: number;
    readonly height: number;
}
/**
 * One handle in a view (Blender's wmGizmo): something drawn in the overlay scene, a screen-space hit test,
 * and an `invoke` that starts an operator when pressed. Gizmos never edit the document themselves.
 */
export interface Gizmo {
    readonly object: Object3D;
    highlight: boolean;
    /** Distance in CSS pixels from (x, y) to this gizmo; `Infinity` when it cannot be hit. */
    hitTest(ctx: GizmoContext, x: number, y: number): number;
    invoke(ctx: GizmoContext, event: ViewInputEvent): void;
}
/**
 * Gizmos that appear together (Blender's wmGizmoGroupType). `poll` decides whether the group shows in a view;
 * `refresh` follows the document and selection; `drawPrepare` adapts to the camera (constant screen size).
 * Both run before every draw and before hit tests.
 */
export interface GizmoGroup {
    readonly id: string;
    readonly gizmos: readonly Gizmo[];
    poll(ctx: GizmoContext): boolean;
    refresh(ctx: GizmoContext): void;
    drawPrepare(ctx: GizmoContext): void;
    dispose(): void;
}
/** What a GizmoLayer needs from its viewport. */
export type GizmoHost = OperatorHost & {
    readonly editor: ThreeEditor | null;
    tag(reason: DirtyReason): void;
};
/**
 * The gizmos of one viewport: an input behavior in the gizmo band (ADR-0004) and an overlay that draws them.
 * Hovering highlights a gizmo and redraws only overlays; pressing one invokes it, which usually starts a
 * modal operator that takes the pointer from there.
 */
export declare class GizmoLayer implements Behavior, Overlay {
    readonly priority: number;
    readonly root: Group<import("three").Object3DEventMap>;
    private readonly _host;
    private _groups;
    private _hovered;
    private _pressed;
    constructor(host: GizmoHost);
    get groups(): readonly GizmoGroup[];
    /** Replaces the groups (the active tool's). Old groups are disposed. */
    setGroups(groups: GizmoGroup[]): void;
    prepare(ctx: OverlayContext): void;
    dispose(): void;
    hover(event: ViewInputEvent): boolean;
    hoverEnd(): void;
    wantsCapture(event: ViewInputEvent): boolean;
    begin(event: ViewInputEvent): void;
    update(): void;
    end(): void;
    cancel(): void;
    private _context;
    private _hitTest;
    private _setHovered;
}
/** World units per CSS pixel at `point` (constant screen-size gizmos). */
export declare function worldPerPixelAt(camera: PerspectiveCamera | OrthographicCamera, point: Vector3, height: number): number;
/** Projects a world point to CSS pixels in a view of `width` x `height`. */
export declare function projectToPixels(camera: PerspectiveCamera | OrthographicCamera, point: Vector3, width: number, height: number, out: Vector3): Vector3;
