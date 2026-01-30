import { StorageTexture, WebGPURenderer, ComputeNode } from 'three/webgpu';
import { ThreeApplet, IoThreeExample } from '@io-gui/three';
export declare class ComputeTextureExample extends ThreeApplet {
    storageTexture: StorageTexture;
    computeNode: ComputeNode;
    constructor();
    onRendererInitialized(renderer: WebGPURenderer): Promise<void>;
}
export declare class IoComputeTextureExample extends IoThreeExample {
    applet: ComputeTextureExample;
    ready(): void;
}
export declare const ioComputeTextureExample: (arg0?: import("@io-gui/core").IoElementProps | Array<import("@io-gui/core").VDOMElement | null> | string, arg1?: Array<import("@io-gui/core").VDOMElement | null> | string) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoComputeTextureExample.d.ts.map