import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/build/three.webgpu.js';
import { ThreeState } from '../../nodes/ThreeState.js';
export declare class WebGPUComputeTexture extends ThreeState {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor();
    onRendererReady(renderer: WebGPURenderer): void;
}
//# sourceMappingURL=WebGPUComputeTexture.d.ts.map