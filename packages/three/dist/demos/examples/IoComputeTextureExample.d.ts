import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/webgpu';
import { ThreeApplet, IoThreeExample, ThreeAppletProps } from '@io-gui/three';
export declare class ComputeTextureExample extends ThreeApplet {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor(args: ThreeAppletProps);
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
}
export declare class IoComputeTextureExample extends IoThreeExample {
    applet: ComputeTextureExample;
    ready(): void;
}
export declare const ioComputeTextureExample: (arg0: any) => import("@io-gui/core").VDOMElement;
