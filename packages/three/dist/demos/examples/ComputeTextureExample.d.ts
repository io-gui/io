import { StorageTexture, ComputeNode, WebGPURenderer } from 'three/webgpu';
import { ThreeDocument, ThreeDocumentProps } from '@io-gui/three';
export declare class ComputeTextureExample extends ThreeDocument {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor(args?: ThreeDocumentProps);
    onRendererInitialized(renderer: WebGPURenderer): void;
}
