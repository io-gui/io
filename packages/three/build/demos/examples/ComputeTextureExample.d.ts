import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/webgpu';
import { ThreeState } from 'io-three';
export declare class ComputeTextureExample extends ThreeState {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): void;
}
//# sourceMappingURL=ComputeTextureExample.d.ts.map