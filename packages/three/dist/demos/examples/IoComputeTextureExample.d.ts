import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class ComputeTextureExample extends ThreeEditor {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor(args: ThreeEditorProps);
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
}
export declare class IoComputeTextureExample extends IoThreeExample {
    editor: ComputeTextureExample;
    ready(): void;
}
export declare const ioComputeTextureExample: (arg0: any) => import("@io-gui/core").VDOMElement;
