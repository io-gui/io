import { Object3D, OrthographicCamera, PerspectiveCamera, WebGPURenderer } from 'three/webgpu';
/**
 * One read-back ID buffer of a view: per CSS pixel, which edit object (`slot`, 1-based index into
 * `objects`, 0 = an occluder or nothing), which primitive (`element`, 1-based, 0 = none) and the
 * view-space depth of the front surface (0 = nothing drawn).
 */
export interface IdBufferData {
    readonly width: number;
    readonly height: number;
    /** Floats per row (rows are padded to 256 bytes). */
    readonly stride: number;
    /** RGBA float per pixel: slot, element, depth, 1. Row 0 is the top. */
    readonly data: Float32Array;
    readonly objects: readonly Object3D[];
}
export type IdSample = {
    slot: number;
    element: number;
    depth: number;
};
/** Reads one pixel of an ID buffer (outside the buffer reads as nothing). */
export declare function readIdBuffer(buffer: IdBufferData, x: number, y: number, out?: IdSample): IdSample;
/**
 * Draws the ID buffer for component picking (ADR-0007): edit objects as non-indexed triangles carrying
 * their primitive index, every other visible mesh as an occluder, into a float target at CSS-pixel size,
 * then reads it back. Proxies share geometry with the scene; content materials are never touched.
 * Deformation (skinning, morph targets) is not applied: components are picked on the rest shape.
 */
export declare class IdPass {
    private readonly _renderer;
    private readonly _target;
    private readonly _scene;
    private readonly _proxies;
    private readonly _slot;
    private readonly _idMaterial;
    private readonly _occluderMaterial;
    constructor(renderer: WebGPURenderer);
    /** Draws `objects` (edit set) and the occluders under `scene` and reads the buffer back. */
    read(scene: Object3D, camera: PerspectiveCamera | OrthographicCamera, objects: readonly Object3D[], width: number, height: number): Promise<IdBufferData>;
    private _sync;
    dispose(): void;
}
