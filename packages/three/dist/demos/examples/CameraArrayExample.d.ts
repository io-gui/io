import { ArrayCamera, Mesh } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/**
 * A spinning cylinder in front of an ArrayCamera of 6×6 sub-cameras, laid out for a square canvas.
 * Views copy scene cameras into a plain camera (ADR-0005), so a camera view looks through the array's main
 * camera, not the grid. Plays when opened.
 */
export declare class CameraArrayExample extends ThreeDocument {
    arrayCamera: ArrayCamera;
    mesh: Mesh;
    constructor(args?: ThreeDocumentProps);
    /** Lays the sub-cameras out in a grid over a `width` × `height` canvas. */
    updateCameras(width: number, height: number): void;
    onAnimate(): void;
}
