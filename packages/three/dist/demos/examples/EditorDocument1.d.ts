import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
import { CanvasTexture } from 'three/webgpu';
/** 8×8 checker of `color` and light gray, so the UV view shows whose texture it lays out. */
export declare function checkerTexture(color: string): CanvasTexture<HTMLCanvasElement>;
/** Four checker-textured primitives in a row, lit by an ambient and a directional light. */
export declare class EditorDocument1 extends ThreeDocument {
    constructor(args?: ThreeDocumentProps);
}
