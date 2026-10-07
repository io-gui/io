import type { SelectionDomain } from '../selection/SelectionModel.js';
import { ComponentSet } from '../selection/ComponentSet.js';
import type { Topology } from './Topology.js';
/** Number of elements of `domain` in a topology (0 for domains it does not have). */
export declare function topologyDomainSize(topology: Topology, domain: SelectionDomain): number;
/** What a selection in one domain means in the others, for drawing and domain switching. */
export interface DerivedComponents {
    point: ComponentSet;
    edge: ComponentSet;
    primitive: ComponentSet;
}
/**
 * Derives point, edge and primitive selection from a selection in `domain` the way Blender switches select
 * modes: going down (primitive → edge → point) selects every element touched; going up selects an element
 * when all of its lower elements are selected. `corner` derives like `point`, per triangle corner.
 */
export declare function deriveComponents(topology: Topology, domain: SelectionDomain, set: ComponentSet | undefined): DerivedComponents;
/** Corners whose point is selected in `derived` (the 3D selection seen per UV corner). */
export declare function cornersFromPoints(topology: Topology, point: ComponentSet): ComponentSet;
/** Converts a selection from one domain to another (select mode switching). */
export declare function convertComponents(topology: Topology, from: SelectionDomain, set: ComponentSet | undefined, to: SelectionDomain): ComponentSet;
