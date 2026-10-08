import { AnimationMixer, Mesh, MeshBasicNodeMaterial, Vector3 } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class BackdropAreaExample extends ThreeEditor {
    mixer?: AnimationMixer;
    box: Mesh;
    blurredBlurMaterial: MeshBasicNodeMaterial;
    depthMaterial: MeshBasicNodeMaterial;
    checkerMaterial: MeshBasicNodeMaterial;
    pixelMaterial: MeshBasicNodeMaterial;
    materials: Record<string, MeshBasicNodeMaterial>;
    boxScale: Vector3;
    material: string;
    constructor(args: ThreeEditorProps);
    materialChanged(): void;
    private loadModel;
    onAnimate(delta: number): void;
}
export declare class IoBackdropAreaExample extends IoThreeExample {
    editor: BackdropAreaExample;
    ready(): void;
}
export declare const ioBackdropAreaExample: (arg0: any) => import("@io-gui/core").VDOMElement;
