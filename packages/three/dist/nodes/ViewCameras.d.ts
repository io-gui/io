import { ReactiveNode, ReactiveNodeProps, Binding } from '@io-gui/core';
import { IoThreeViewport } from '../elements/IoThreeViewport.js';
import { ThreeApplet } from './ThreeApplet.js';
import { Camera, Object3D, OrthographicCamera, PerspectiveCamera } from 'three/webgpu';
export type ViewCamerasProps = ReactiveNodeProps & {
    viewport: IoThreeViewport;
    applet: ThreeApplet | Binding;
    cameraSelect: string | Binding;
};
export declare class ViewCameras extends ReactiveNode {
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
        object: Object3D;
        overscan: number;
    }>): void;
    frameObjectAll(object: Object3D, overscan?: number): void;
    frameObject(object: Object3D, camera: Camera, overscan?: number): void;
    setOverscan(width: number, height: number, overscan: number): void;
    resetOverscan(): void;
    dispose(): void;
}
//# sourceMappingURL=ViewCameras.d.ts.map