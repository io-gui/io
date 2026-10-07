import { Camera, Object3D, Vector3 } from 'three/webgpu';
import type { InputHost } from '../input/ViewInputEvent.js';
export interface PickHit {
    object: Object3D;
    uuid: string;
    distance: number;
    point: Vector3;
}
/** Rectangle in viewport pixels (corners in any order). */
export type PickRect = {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
};
export type PickFilter = (object: Object3D) => boolean;
/**
 * What is under the pointer in a view (ADR-0007). Async because GPU readback (ID buffers) is.
 * Implementations: `RaycastPicker` now; a `three-mesh-bvh` picker and an ID-buffer picker later.
 */
export interface Picker {
    pick(host: InputHost, x: number, y: number, filter?: PickFilter): Promise<PickHit | null>;
    pickRect(host: InputHost, rect: PickRect, filter?: PickFilter): Promise<PickHit[]>;
}
/** Line and point hit radius, in screen pixels. */
export declare const PICK_RADIUS = 4;
/**
 * Objects that draw something, are visible down from the root, and are not opted out with
 * `userData.selectable = false` (on the object or an ancestor; use it for helpers such as grids).
 */
export declare function isSelectable(object: Object3D): boolean;
export declare function collectSelectable(root: Object3D, camera?: Camera, filter?: PickFilter): Object3D[];
export type RaycastPickerOptions = {
    /** What to raycast. Default: the host's content scene. */
    root?: (host: InputHost) => Object3D | null;
    /** Maps a hit object to the document object it stands for (or null to skip). Default: the hit itself. */
    resolve?: (object: Object3D) => Object3D | null;
};
/**
 * Picks with a plain `Raycaster` against the view's draw camera. Box selection tests each object's
 * projected world bounds against the rectangle (approximate: bounds, not drawn pixels).
 * Views that draw stand-ins for document objects (the UV view) pass `root` and `resolve`.
 */
export declare class RaycastPicker implements Picker {
    private readonly _root;
    private readonly _resolve;
    constructor(options?: RaycastPickerOptions);
    pick(host: InputHost, x: number, y: number, filter?: PickFilter): Promise<PickHit | null>;
    pickRect(host: InputHost, rect: PickRect, filter?: PickFilter): Promise<PickHit[]>;
}
export declare const defaultPicker: RaycastPicker;
