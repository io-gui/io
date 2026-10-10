import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
import { CanvasTexture } from 'three/webgpu';
/** 8×8 checker of `color` and light gray, so the UV view shows whose texture it lays out. */
export declare function checkerTexture(color: string): CanvasTexture<HTMLCanvasElement>;
/**
 * Primitives on a floor that cannot be selected, and a `Stack` group of two meshes; ACES tone mapping by default.
 */
export declare class EditorDocument2 extends ThreeDocument {
    constructor(args?: ThreeDocumentProps);
}
