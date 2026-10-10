import { AnimationMixer, Mesh, MeshBasicNodeMaterial, Vector3 } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
/**
 * A box whose backdrop material (blurred, depth, checker or pixel; Document tab) filters the dancing Michelle
 * model behind it. Plays when opened.
 */
export declare class BackdropAreaExample extends ThreeDocument {
    mixer?: AnimationMixer;
    box: Mesh;
    blurredBlurMaterial: MeshBasicNodeMaterial;
    depthMaterial: MeshBasicNodeMaterial;
    checkerMaterial: MeshBasicNodeMaterial;
    pixelMaterial: MeshBasicNodeMaterial;
    materials: Record<string, MeshBasicNodeMaterial>;
    boxScale: Vector3;
    material: string;
    constructor(args?: ThreeDocumentProps);
    materialChanged(): void;
    private loadModel;
    onAnimate(delta: number): void;
}
