import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/webgpu';
import { ThreeState } from '@io-gui/three';
export declare class ComputeTextureExample extends ThreeState {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
}
//# sourceMappingURL=compute_texture.d.ts.map