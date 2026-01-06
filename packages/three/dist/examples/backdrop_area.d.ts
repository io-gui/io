import { AnimationMixer, Mesh, MeshBasicNodeMaterial, Vector3 } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class WebGPUBackdropAreaExample extends ThreeApplet {
    mixer?: AnimationMixer;
    box: Mesh;
    blurredBlurMaterial: MeshBasicNodeMaterial;
    depthMaterial: MeshBasicNodeMaterial;
    checkerMaterial: MeshBasicNodeMaterial;
    pixelMaterial: MeshBasicNodeMaterial;
    materials: Record<string, MeshBasicNodeMaterial>;
    boxScale: Vector3;
    material: string;
    constructor();
    materialChanged(): void;
    private loadModel;
    onAnimate(delta: number): void;
}
//# sourceMappingURL=backdrop_area.d.ts.map