import { Group, Object3D } from 'three/webgpu';
import type { InputHost } from '../../input/ViewInputEvent.js';
import type { PickRect } from '../../selection/Picker.js';
import type { SelectionDomain, SelectionModel } from '../../selection/SelectionModel.js';
import { ComponentSet } from '../../selection/ComponentSet.js';
import { ComponentHit, ComponentPicker } from '../../selection/ComponentPicker.js';
import { Topology } from '../../geometry/Topology.js';
import type { Mesh as MeshType } from 'three/webgpu';
/** Meshes of the edit set that have UVs. */
export declare function getUVEditMeshes(selection: SelectionModel | null | undefined): MeshType[];
/** What the UV view shows and has selected for one mesh, per triangle corner. */
export interface UVEditState {
    topology: Topology;
    /** Faces drawn: with `uvSync` off only faces selected in 3D (Blender), otherwise all. */
    shown: ComponentSet;
    /** Selected corners. */
    corners: ComponentSet;
    /** Selected faces. */
    faces: ComponentSet;
    /** Triangle edge `f * 3 + k` (corner k to k+1) selected. */
    edges: ComponentSet;
}
/**
 * Resolves the UV view's selection for one mesh (ADR-0007). With `uvSync` the 3D selection is shown per
 * corner; without it the view has its own `corner` selection over the faces selected in 3D.
 */
export declare function getUVEditState(selection: SelectionModel, mesh: MeshType): UVEditState;
/** The UV layout of one mesh in edit mode: faces, triangle edges and UV vertices (corners) with states. */
export declare class UVEditCage {
    readonly group: Group<import("three").Object3DEventMap>;
    readonly key: string;
    private readonly _fill;
    private readonly _wire;
    private readonly _points;
    private readonly _pointStates;
    constructor(mesh: MeshType);
    update(state: UVEditState, showPoints: boolean): void;
    dispose(): void;
}
/** Changes when the mesh's topology or UVs change. */
export declare function uvKey(mesh: MeshType): string;
/**
 * Component picking in the UV view, on the CPU in UV space (nothing is occluded). With `uvSync` off picks
 * are stored as corners: a UV vertex selects every shown corner sharing its buffer vertex, a face its three
 * corners. With `uvSync` on picks map to the mesh domains (point, edge, primitive).
 */
export declare class UVComponentPicker implements ComponentPicker {
    objects(host: InputHost): Object3D[];
    domain(host: InputHost): SelectionDomain;
    pick(host: InputHost, x: number, y: number): Promise<ComponentHit[]>;
    pickRect(host: InputHost, rect: PickRect): Promise<ComponentHit[]>;
    /** Corners as stored hits: shown corners sharing their UV vertex, or (uvSync) their points. */
    private _cornerHits;
    private _faceHits;
}
