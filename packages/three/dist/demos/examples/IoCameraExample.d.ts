import { PerspectiveCamera, OrthographicCamera, Group, Mesh } from 'three/webgpu';
import { ThreeEditor, IoThreeExample, ThreeEditorProps } from '@io-gui/three';
export declare class CameraExample extends ThreeEditor {
    perspectiveCamera: PerspectiveCamera;
    orthographicCamera: OrthographicCamera;
    cameraRig: Group;
    mesh: Mesh;
    constructor(args: ThreeEditorProps);
    onAnimate(): void;
}
export declare class IoCameraExample extends IoThreeExample {
    editor: CameraExample;
    ready(): void;
}
export declare const ioCameraExample: (arg0: any) => import("@io-gui/core").VDOMElement;
