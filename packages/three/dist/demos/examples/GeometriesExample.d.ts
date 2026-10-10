import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/** The built-in geometries in a 4×4 grid, sharing one UV grid textured material. Spins while playing; plays when opened. */
export declare class GeometriesExample extends ThreeDocument {
    private material;
    wireframe: boolean;
    constructor(args?: ThreeDocumentProps);
    wireframeChanged(): void;
    onAnimate(delta: number, time: number): void;
}
