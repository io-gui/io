import { StorageTexture, ComputeNode, WebGPURenderer } from 'three/webgpu';
import { Document, DocumentProps } from '@io-gui/three';
export declare class ComputeTextureExample extends Document {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor(args?: DocumentProps);
    onRendererInitialized(renderer: WebGPURenderer): void;
}
