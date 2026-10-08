import { ArrayCamera, Mesh } from 'three/webgpu';
import { ThreeEditor, IoThreeViewport, ThreeEditorProps } from '@io-gui/three';
export declare class CameraArrayExample extends ThreeEditor {
    arrayCamera: ArrayCamera;
    mesh: Mesh;
    constructor(args: ThreeEditorProps);
    updateCameras(width: number, height: number): void;
    onAnimate(): void;
}
export declare class IoCameraArrayExample extends IoThreeViewport {
    editor: CameraArrayExample;
    onResized(): void;
}
export declare const ioCameraArrayExample: (arg0: any) => import("@io-gui/core").VDOMElement;
