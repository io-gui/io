import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/build/three.webgpu.js';
import { ThreeState } from 'io-three';
export declare class ComputeTextureExample extends ThreeState {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): void;
}
//# sourceMappingURL=ComputeTextureExample.d.ts.map