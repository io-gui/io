import { Object3D, Quaternion, Vector3 } from 'three/webgpu';
export type AxisView = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back';
export type ViewProjection = 'perspective' | 'orthographic';
export type ViewNavigationData = {
    target: [number, number, number];
    rotation: [number, number, number, number];
    distance: number;
    projection: ViewProjection;
    fov: number;
    near: number;
    far: number;
    axisView: AxisView | null;
    cameraSource: string | null;
    framed: boolean;
};
export declare const AXIS_VIEW_DIRECTIONS: Readonly<Record<AxisView, readonly [number, number, number]>>;
/**
 * Navigation state of one view, stored as numbers (ADR-0005), modelled on Blender's RegionView3D.
 * The camera used for drawing and picking is built from this state per frame by `ThreeView.getCamera()`.
 */
export declare class ViewNavigation {
    /** Orbit pivot. */
    readonly target: Vector3;
    /** View orientation; the view looks down its local -Z. */
    readonly rotation: Quaternion;
    /** Distance from the target. In orthographic views it also sets the frustum size. */
    distance: number;
    projection: ViewProjection;
    /** Vertical field of view in degrees, for a square viewport. */
    fov: number;
    near: number;
    far: number;
    axisView: AxisView | null;
    /** `uuid` of a scene camera to look through, or null. */
    cameraSource: string | null;
    /** False until the view has been framed or restored, so a new view frames its scene once. */
    framed: boolean;
    constructor();
    /** Orients the view to look at the target from `direction` (pointing from target to eye). */
    setDirection(direction: Vector3): void;
    /** Switches to an orthographic axis view, or back to the default perspective view with `null`. */
    setAxisView(axis: AxisView | null): void;
    getPosition(out: Vector3): Vector3;
    /** Half height of the visible area at the target, for a square viewport. */
    getHalfHeight(): number;
    /**
     * Fits `object` into a square viewport without changing the view direction.
     * `padding` > 1 leaves room around the object.
     */
    frame(object: Object3D, padding?: number): void;
    copy(source: ViewNavigation): this;
    toJSON(): ViewNavigationData;
    applyJSON(data: Partial<ViewNavigationData>): this;
}
