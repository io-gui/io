import { Group } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/** The convex hull of a dodecahedron's vertices, drawn as points and a translucent mesh. Spins while playing; plays when opened. */
export declare class GeometryConvexExample extends ThreeDocument {
    group: Group;
    constructor(args?: ThreeDocumentProps);
    onAnimate(): void;
}
