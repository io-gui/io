import { Group } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
/** The convex hull of a dodecahedron's vertices, drawn as points and a translucent mesh. Spins while playing; plays when opened. */
export declare class GeometryConvexExample extends Document {
    group: Group;
    constructor(args?: DocumentProps);
    onAnimate(): void;
}
