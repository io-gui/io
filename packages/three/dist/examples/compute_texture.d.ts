import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/webgpu';
import { ThreeApplet } from '@io-gui/three';
export declare class ComputeTextureExample extends ThreeApplet {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
}
//# sourceMappingURL=compute_texture.d.ts.map