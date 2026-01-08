import { Node, NodeProps, Binding } from '@io-gui/core';
import { IoThreeViewport } from '../elements/IoThreeViewport.js';
import { ThreeApplet } from './ThreeApplet.js';
import { Camera, Object3D, OrthographicCamera, PerspectiveCamera } from 'three/webgpu';
export type ViewCamerasProps = NodeProps & {
    viewport: IoThreeViewport;
    applet: ThreeApplet | Binding;
    cameraSelect: string | Binding;
};
export declare class ViewCameras extends Node {
    private viewport;
    applet: ThreeApplet;
    cameraSelect: string;
    camera: PerspectiveCamera | OrthographicCamera;
    private readonly defaultCameras;
    private readonly orbitControls;
    static get Listeners(): {
        'frame-object': string;
    };
    constructor(args: ViewCamerasProps);
    cameraSelectChanged(): void;
    cameraSelectChangedDebounced(): void;
    cameraChanged(): void;
    appletChanged(): void;
    onFrameObject(event: CustomEvent<{
        scene: Object3D;
    }>): void;
    frameObjectAll(object: Object3D): void;
    frameObject(object: Object3D, camera: Camera): void;
    setOverscan(width: number, height: number, overscan: number): void;
    resetOverscan(): void;
    dispose(): void;
}
//# sourceMappingURL=ViewCameras.d.ts.map