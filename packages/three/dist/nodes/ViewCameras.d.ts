import { Node, NodeProps, Binding } from '@io-gui/core';
import { IoThreeViewport } from '../elements/IoThreeViewport.js';
import { ThreeState } from './ThreeState.js';
import { Camera, Object3D, OrthographicCamera, PerspectiveCamera } from 'three/webgpu';
export type ViewCamerasProps = NodeProps & {
    viewport: IoThreeViewport;
    state: ThreeState;
    cameraSelect: string | Binding<string>;
};
export declare class ViewCameras extends Node {
    private width;
    private height;
    private viewport;
    state: ThreeState;
    cameraSelect: string;
    camera: PerspectiveCamera | OrthographicCamera;
    private readonly defaultCameras;
    private readonly orbitControls;
    constructor(args: ViewCamerasProps);
    cameraSelectChanged(): void;
    setSize(width: number, height: number): void;
    cameraChanged(): void;
    stateChanged(): void;
    frameObject(object: Object3D, camera: Camera): void;
    dispose(): void;
}
//# sourceMappingURL=ViewCameras.d.ts.map