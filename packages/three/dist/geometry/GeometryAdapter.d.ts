import { BufferGeometry, Object3D, Vector3 } from 'three/webgpu';
import type { SelectionDomain } from '../selection/SelectionModel.js';
import { Topology, TopologyKind } from './Topology.js';
/**
 * Component access for one kind of object (ADR-0007): which domains it has, how many elements each holds,
 * where they are, and the triangles the ID pass draws for picking primitives. The selection model knows
 * nothing about geometry; pickers and overlays go through adapters.
 */
export interface GeometryAdapter {
    readonly id: string;
    readonly kind: TopologyKind;
    /** Domains that can be selected in edit mode, in select-mode order. */
    readonly domains: readonly SelectionDomain[];
    accepts(object: Object3D): boolean;
    getTopology(object: Object3D): Topology;
    domainSize(object: Object3D, domain: SelectionDomain): number;
    /** Element position in the object's local space (edges: midpoint; primitives: centroid). */
    elementPosition(object: Object3D, domain: SelectionDomain, index: number, out: Vector3): Vector3;
    /**
     * Non-indexed triangles with a `pickId` attribute (primitive index + 1) for the ID pass, or null when the
     * object has no faces (lines and points are picked on the CPU).
     */
    getPrimitiveIdGeometry(object: Object3D): BufferGeometry | null;
}
/** The shared part of the built-in adapters: everything comes from the topology cache. */
declare abstract class TopologyAdapter implements GeometryAdapter {
    abstract readonly id: string;
    abstract readonly kind: TopologyKind;
    abstract readonly domains: readonly SelectionDomain[];
    abstract accepts(object: Object3D): boolean;
    getTopology(object: Object3D): Topology;
    domainSize(object: Object3D, domain: SelectionDomain): number;
    elementPosition(object: Object3D, domain: SelectionDomain, index: number, out: Vector3): Vector3;
    getPrimitiveIdGeometry(_object: Object3D): BufferGeometry | null;
}
export declare class MeshAdapter extends TopologyAdapter {
    readonly id = "mesh";
    readonly kind = "mesh";
    readonly domains: readonly ["point", "edge", "primitive"];
    accepts(object: Object3D): boolean;
    getPrimitiveIdGeometry(object: Object3D): BufferGeometry;
}
export declare class LineSegmentsAdapter extends TopologyAdapter {
    readonly id = "lineSegments";
    readonly kind = "line";
    readonly domains: readonly ["point", "edge"];
    accepts(object: Object3D): boolean;
}
export declare class PointsAdapter extends TopologyAdapter {
    readonly id = "points";
    readonly kind = "points";
    readonly domains: readonly ["point"];
    accepts(object: Object3D): boolean;
}
/** Registers an adapter. Later registrations are asked first, so they can take over built-in kinds. */
export declare function registerGeometryAdapter(adapter: GeometryAdapter): void;
/** The adapter for an object, or null when its components cannot be selected. */
export declare function getGeometryAdapter(object: Object3D): GeometryAdapter | null;
/**
 * The objects edit mode works on (Blender's objects in edit mode): selected objects and their descendants
 * that have a geometry adapter. Visibility is not checked here; pickers and overlays skip hidden ones.
 */
export declare function getEditObjects(objects: readonly Object3D[]): Object3D[];
export {};
