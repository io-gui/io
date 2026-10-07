import { BufferGeometry, Color, Mesh, Object3D, Scene } from 'three/webgpu';
import type { DocumentChange } from '../../editor/ChangeBus.js';
import type { DirtyReason } from '../RenderScheduler.js';
import type { PipelineContext } from '../ViewPipeline.js';
import { RaycastPicker } from '../../selection/Picker.js';
import { RenderTargetPipeline } from './RenderTargetPipeline.js';
import { UVComponentPicker } from './UVEdit.js';
/** Meshes with a `uv` attribute under the selected objects: the edit set the UV view shows. */
export declare function collectUVMeshes(objects: readonly Object3D[]): Mesh[];
/** A flat copy of a geometry's UV layout: `uv` becomes the xy position, the index is kept. */
export declare function buildUVGeometry(geometry: BufferGeometry): BufferGeometry;
/**
 * The `uv` view kind's pipeline (ADR-0006). It never draws the content scene: it draws the 0–1 grid, the
 * active object's color texture, and the UV layout of every selected mesh (the edit set), active brighter.
 * Picking hits the UV layouts and resolves to their meshes. Redraws on selection and geometry changes.
 * In edit mode it draws UV faces, edges and vertices with their selection instead, and picks components
 * (`componentPicker`, ADR-0007).
 */
export declare class UVPipeline extends RenderTargetPipeline {
    readonly toneMapping: 0;
    readonly picker: RaycastPicker;
    readonly componentPicker: UVComponentPicker;
    readonly uvScene: Scene<import("three").Object3DEventMap>;
    /** Show the active object's `material.map` behind the layout. */
    showTexture: boolean;
    readonly wireColor: Color;
    readonly activeColor: Color;
    private readonly _layouts;
    private readonly _entries;
    private readonly _cages;
    private readonly _editLayouts;
    private readonly _grid;
    private readonly _textureMaterial;
    private readonly _texturePlane;
    private readonly _wire;
    private readonly _wireActive;
    private readonly _fill;
    private readonly _fillActive;
    constructor();
    listens(change: DocumentChange): DirtyReason | false;
    protected draw(ctx: PipelineContext): void;
    private _syncEditLayouts;
    private _removeCage;
    private _syncLayouts;
    private _syncTexture;
    private _removeEntry;
    dispose(): void;
}
