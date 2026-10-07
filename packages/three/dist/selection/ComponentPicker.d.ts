import { Object3D, OrthographicCamera, PerspectiveCamera } from 'three/webgpu';
import type { InputHost } from '../input/ViewInputEvent.js';
import type { SelectionDomain } from './SelectionModel.js';
import type { PickRect } from './Picker.js';
import { IdBufferData } from '../render/IdPass.js';
/** One picked component. `size` is the domain size the index belongs to (for `SelectionEdit.components`). */
export interface ComponentHit {
    object: Object3D;
    uuid: string;
    domain: SelectionDomain;
    index: number;
    size: number;
    /** Pixels from the pointer (0 for rectangle hits). */
    distance: number;
}
/**
 * Component picking in one view (ADR-0007). A click returns the hits of one element; that can be several
 * stored components (a UV vertex is every corner that shares it). Async because the ID buffer is read back.
 */
export interface ComponentPicker {
    /** Objects whose components this view shows and picks. */
    objects(host: InputHost): Object3D[];
    /** Domain picks are stored in (the UV view stores `corner` unless `uvSync` is on). */
    domain(host: InputHost): SelectionDomain;
    pick(host: InputHost, x: number, y: number): Promise<ComponentHit[]>;
    pickRect(host: InputHost, rect: PickRect): Promise<ComponentHit[]>;
}
/** Point and edge hit radius in CSS pixels. */
export declare const COMPONENT_PICK_RADIUS = 10;
/** Reads the ID buffer for a view: draws edit `objects` with the view's camera at its CSS size. */
export type IdBufferSource = (host: InputHost, camera: PerspectiveCamera | OrthographicCamera, objects: readonly Object3D[], width: number, height: number) => Promise<IdBufferData | null>;
export type IdComponentPickerOptions = {
    /** Where the ID buffer comes from; without one (or when it returns null) every pick is x-ray. */
    source?: IdBufferSource;
};
/**
 * Component picking in 3D views. Primitives come from the ID buffer (the front-most triangle under the
 * pointer); points and edges are projected on the CPU and kept when the ID buffer's depth shows them, so
 * hidden ones are skipped. In x-ray (`view.xray`) or without an ID buffer everything is projected and
 * nothing is occluded; primitives are then raycast (click) or tested by centroid (rectangle).
 * The buffer is cached until the camera, size, edit set or content changes (`invalidate()`).
 */
export declare class IdComponentPicker implements ComponentPicker {
    private readonly _source;
    private _cache;
    constructor(options?: IdComponentPickerOptions);
    /** Drops the cached ID buffer (content changed). */
    invalidate(): void;
    objects(host: InputHost): Object3D[];
    domain(host: InputHost): SelectionDomain;
    pick(host: InputHost, x: number, y: number): Promise<ComponentHit[]>;
    pickRect(host: InputHost, rect: PickRect): Promise<ComponentHit[]>;
    private _buffer;
    private _nearestPoint;
    private _nearestSegment;
}
