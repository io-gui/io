import { AnimationMixer, Mesh, MeshBasicNodeMaterial, Vector3 } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class BackdropAreaExample extends ThreeApplet {
    mixer?: AnimationMixer;
    box: Mesh;
    blurredBlurMaterial: MeshBasicNodeMaterial;
    depthMaterial: MeshBasicNodeMaterial;
    checkerMaterial: MeshBasicNodeMaterial;
    pixelMaterial: MeshBasicNodeMaterial;
    materials: Record<string, MeshBasicNodeMaterial>;
    boxScale: Vector3;
    material: string;
    constructor(args: ThreeAppletProps);
    materialChanged(): void;
    private loadModel;
    onAnimate(delta: number): void;
}
export declare class IoBackdropAreaExample extends IoThreeExample {
    applet: BackdropAreaExample;
}
export declare const ioBackdropAreaExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoBackdropAreaExample.d.ts.map